const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    activeAddProduct: true,
    formsCss: true
  });
}

exports.postAddProduct = (req, res) => {
  const product = new Product(req.body.title);
  product.save(() => {
    res.redirect('/');
  });
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop', {
      products, pageTitle: 'Shop',
      path: '/',
      hasProducts: products.length > 0,
      activeShop: true,
      productCss: true
    });
  });
}
