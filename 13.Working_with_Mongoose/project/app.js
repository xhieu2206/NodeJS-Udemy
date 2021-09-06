const path = require('path');
const PREDEFINED_USER_ID = '613648d6837d38074d53a701';
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById(PREDEFINED_USER_ID)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect('mongodb+srv://xhieu2206:XNZEtGgJ$v6V7n2@nodejs-course.h1piu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected!!!');
    User
      .findOne()
      .then(user => {
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
      })
  })
  .then(() => {
    app.listen(4000);
  })
  .catch(err => console.log(err));
