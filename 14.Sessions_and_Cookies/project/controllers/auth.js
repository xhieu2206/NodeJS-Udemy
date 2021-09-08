const User = require('../models/user');
const PRE_DEFINED_USER_ID = '613648d6837d38074d53a701';

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie').split('; ')[2].split('=')[1] === 'true';
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  /* default thì cookie sẽ được send cùng với mọi request, không chỉ nhận được mà còn được gửi đi, có thể tham khảo thêm các value khác */
  /* sử dụng session thay cho cookie
    res.setHeader('Set-Cookie', 'loggedIn=true');
   */
  User
    .findById(PRE_DEFINED_USER_ID)
    .then(user => {
      req.session.user = user;
      req.session.isLoggedIn = true;
      req.session.save(err => {
        console.log(err);
        res.redirect('/');
      });
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  })
};
