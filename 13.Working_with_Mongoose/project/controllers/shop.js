const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      console.log(products);
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => console.log(`CLOG "err": `, err));
};

exports.getProduct = (req, res) => {
  const prodId = req.params["productId"];
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => console.log(`CLOG "err": `, err));
};

exports.getCart = (req, res) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: user.cart.items,
      });
    })
    .catch(err => console.log(`CLOG error while fetching the cart detail "err": `, err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body['productId'];
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(`CLOG "err": `, err));
};

exports.getOrders = (req, res) => {
  Order
    .find({
      'user.userId': req.user._id,
    })
    .then(orders => {
      res.render('shop/orders', {
        orders,
        path: '/orders',
        pageTitle: 'Your Orders'
      });
    })
    .catch(err => console.log(`CLOG "err": `, err));
};

exports.postOrder = (req, res) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items.map(product => {
        return {
          product: { ...product.productId._doc }, // Dùng để access data của document
          quantity: product.quantity,
        }
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user,
        },
        products,
      });
      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(`CLOG "err": `, err));

};
