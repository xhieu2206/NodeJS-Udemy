const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    activeAddProduct: true,
    formsCss: true
  });
}

exports.postAddProduct = (req, res) => {
  const { title, description, imageUrl, price } = req.body;
  console.log(title, description, imageUrl, price);
  const product = new Product(title, imageUrl, description, price);
  product.save(() => {
    res.redirect('/');
  });
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('admin/products', {
      products, pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
}
