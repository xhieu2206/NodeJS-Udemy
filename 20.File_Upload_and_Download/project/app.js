const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const User = require('./models/user');
const MONGODB_URI = process.env.MONGODB_URI;
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const app = express();
/* setup for saving session in mongodb database */
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});

/* CSRF configuration */
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoute = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
/* Sử dụng để handle file(s) */
app.use(multer({
  dest: 'images'
}).single('image'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  store
}));

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  /* cho phép set local vars truyền xuống views, local có nghĩa là nó sẽ chỉ được truyền đến views rendered mà thôi  */
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User
    .findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoute);

app.get('/500', errorController.get500);

app.use(errorController.get404);

/* mỗi khi chúng ta dùng `next(err)`, express sẽ pass chúng ta đến thẳng middleware này để handling error */
app.use((error, req, res, next) => {
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
  });
});

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected!!!')
    app.listen(process.env.PORT);
  })
  .catch(err => {
    console.log(err);
  });
