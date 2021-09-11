const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const User = require('./models/user');
const MONGODB_URI = 'mongodb+srv://xhieu2206:XNZEtGgJ$v6V7n2@nodejs-course.h1piu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const PRE_DEFINED_USER_ID = '613648d6837d38074d53a701';

const app = express();
/* setup for saving session in mongodb database */
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
})

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoute = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  store
}));

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User
    .findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  User.findById(PRE_DEFINED_USER_ID)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoute);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected!!!')
    app.listen(4000);
  })
  .catch(err => {
    console.log(err);
  });
