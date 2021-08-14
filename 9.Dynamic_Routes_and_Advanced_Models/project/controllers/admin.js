const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
}

exports.postAddProduct = (req, res) => {
  const { title, description, imageUrl, price } = req.body;
  const product = new Product(null, title, imageUrl, description, price);
  product.save(() => {
    res.redirect('/');
  });
}

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params['productId'];
  Product.findById(prodId, product => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product
    });
  })
}

exports.postEditProduct = (req, res) => {
  const { title, price, description, productId, imageUrl } = req.body;
  const product = new Product(productId, title, imageUrl, description, price);
  product.save(() => {
    res.redirect('/admin/products');
  });
}

exports.postDeleteProduct = (req, res) => {
  const productId = req.body['productId'];
  Product.deleteById(productId);
  res.redirect('/admin/products');
}

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render('admin/products', {
      products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
}
