const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL.trim();
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY.trim();
const ROOT_URL = process.env.ROOT_URL.trim();

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: SENDGRID_API_KEY,
  }
}));

exports.getLogin = (req, res) => {
  // const isLoggedIn = req.get('Cookie').split('; ')[2].split('=')[1] === 'true';
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
    errorMessage: message,
  });
};

exports.getSignup = (req, res) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
  });
};

exports.postLogin = (req, res) => {
  /* default thì cookie sẽ được send cùng với mọi request, không chỉ nhận được mà còn được gửi đi, có thể tham khảo thêm các value khác */
  /* sử dụng session thay cho cookie
    res.setHeader('Set-Cookie', 'loggedIn=true');
   */
  const { email, password } = req.body;
  User
    .findOne({ email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          /* dù password có matching hay không, chúng ta cũng sẽ vào phần `then`, chứ không phải nếu sai password thì sẽ vào `catch`. `doMatch` sẽ return true hoặc false tùy vào phép so sánh */
          if (doMatch) {
            req.session.user = user;
            req.session.isLoggedIn = true;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          } else {
            req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
          }
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res) => {
  const { email, password, confirmPassword } = req.body;
  // SKIP THE VALIDATION FOR NOW
  User.
    findOne({
      email: email
    })
    .then(user =>{
      if (user) {
        req.flash('error', 'E-Mail existed already');
        return res.redirect('/signup');
      }
      return bcrypt.hash(password, 12)
        .then(hashedPassword => {
          const newUser = new User({
            email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return newUser.save();
        })
        .then(() => {
          res.redirect('/login');
          return transporter.sendMail({
            to: email,
            from: FROM_EMAIL,
            subject: 'Signup Success!!!',
            html: '<h1>You successfully signed up!!!!</h1>'
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  })
};

exports.getReset = (req, res) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message,
  });
}

exports.postReset = (req, res) => {
  const { email } = req.body;
  /* đây là một function được built-in của nodejs dùng để generate token */
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User
      .findOne({ email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with this email found');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(() => {
        transporter
          .sendMail({
            to: email,
            from: FROM_EMAIL,
            subject: 'Password Reset',
            html: `
              <p>You requested a password reset</p>
              <p>Click this <a href="${ROOT_URL}/new-password/${token}">link to set a new password</a></p>
            `
          })
          .then(() => {
            console.log("Email was sent successfully");
          })
          .catch(err => {
            console.log("Error while sending the email", err);
          });
        res.redirect('/');
      })
      .catch(err => console.log(err));
  });
}

exports.getNewPassword = (req, res) => {
  const token = req.params['token'];
  User
    .findOne({
      resetToken: token,
      resetTokenExpiration: {
        $gt: Date.now()
      }
    })
    .then(user => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch(err => console.log(err));
}

exports.postNewPassword = (req, res) => {
  const { password, userId, passwordToken } = req.body;
  let user;

  User
    .findOne({
      _id: userId,
      resetToken: passwordToken,
      resetTokenExpiration: {
        $gt: Date.now()
      }
    })
    .then(foundedUser => {
      user = foundedUser;
      return bcrypt.hash(password, 12);
    })
    .then(hashedPassword => {
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;
      return user.save();
    })
    .then(() => {
      res.redirect('/login');
    })
    .catch(err => console.log(err));
}
