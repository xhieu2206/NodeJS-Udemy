const bcrypt = require('bcryptjs');
const User = require('../models/user');
const PRE_DEFINED_USER_ID = '613648d6837d38074d53a701';

exports.getLogin = (req, res, next) => {
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

exports.getSignup = (req, res, next) => {
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

exports.postLogin = (req, res, next) => {
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
        })
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  })
};
