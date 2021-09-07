const path = require('path');

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
const authRoute = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('613648d6837d38074d53a701')
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
  .connect(
    'mongodb+srv://xhieu2206:XNZEtGgJ$v6V7n2@nodejs-course.h1piu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useNewUrlParser: true })
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
