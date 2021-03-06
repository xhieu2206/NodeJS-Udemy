const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const User = require('./models/user');
const MONGODB_URI = process.env.MONGODB_URI;
const PRE_DEFINED_USER_ID = '613648d6837d38074d53a701';

const app = express();
/* setup for saving session in mongodb database */
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'session',
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
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Xuan Hieu',
          email: 'xhieu94@gmail.com',
          cart: {
            items: []
          }
        });
        return user.save();
      }
    });
  })
  .then(() => {
    console.log('Connected!!!')
    app.listen(4000);
  })
  .catch(err => {
    console.log(err);
  });
