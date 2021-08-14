const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render('shop/product-list', {
      products,
      pageTitle: 'Products',
      path: '/products'
    });
  });
}

exports.getProduct = (req, res) => {
  const prodId = req.params['productId'];
  Product.findById(prodId, (product) => {
    res.render('shop/product-detail', {
      product,
      pageTitle: product.title,
      path: '/products'
    });
  });
}

exports.getIndex = (req, res) => {
  Product.fetchAll((products) => {
    res.render('shop/index', {
      products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
}

exports.getCart = (req, res) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (let product of products) {
        const cartProductData = cart.products.find(prod => prod.id === product.id)
        if (cartProductData) {
          cartProducts.push({
            productData: product,
            qty: cartProductData.qty
          });
        }
      }
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products: cartProducts
      });
    });
  });
}

exports.postCart = (req, res) => {
  const prodId = req.body.productId ;
  Product.findById(prodId, product => {
    Cart.addProduct(product.id, product.price);
  });
  res.redirect('/cart');
}

exports.postCartDeleteProduct = (req, res) => {
  const productId = req.body["productId"];
  Product.findById(productId, product => {
    Cart.deleteProduct(product.id, product.price, () => {
      res.redirect('/cart');
    });
  });
}

exports.getOrders = (req, res) => {
  res.render('shop/orders', {
    pageTitle: 'Your Orders',
    path: '/orders'
  });
}

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
  });
}
