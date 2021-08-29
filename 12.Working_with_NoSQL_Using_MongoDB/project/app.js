const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User
    .findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(`CLOG "err": `, err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

/*
  Create relationship giữa các models, ở đây chúng ta sẽ tạo ra một OneToMany relationship
*/
Product.belongsTo(User, {
  constraints: true,
  onDelete: 'CASCADE',
});

User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

/*
  Sẽ looking qua tất cả các models mà chúng ta đã defined và về cơ bản sẽ tạo ra các tables cho các Model này. nếu như table đã tồn tại, nó sẽ không overwite những table này.
 */
sequelize
  .sync()
  // .sync({ force: true })
  .then(() => {
    return User.findByPk(1);
  })
  .then(user => {
    if (!user) {
      return User.create({
        name: 'Xuan Hieu',
        email: 'xhieu94@gmail.com',
      });
    }
    return user; // return Promise.resolve(user);
  })
  .then(user => {
    return user.createCart();
  })
  .then(cart => {
    app.listen(4000);
  })
  .catch(err => {
    console.log(`CLOG "err": `, err);
  });
