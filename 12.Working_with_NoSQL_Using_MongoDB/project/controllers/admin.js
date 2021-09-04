const mongodb = require('mongodb');
const Product = require('../models/product');

const ObjectId = mongodb.ObjectId;

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, price, description, imageUrl, null, req.user._id);
  product.save()
    .then(result => {
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(`CLOG "err": `, err);
    });
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query["edit"];
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params["productId"];
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
    .catch(err => console.log(`CLOG error while getting the product with ID "${prodId}" "err": `, err));
};

exports.postEditProduct = (req, res) => {
  const prodId = req.body['productId'];
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const product = new Product(updatedTitle, updatedPrice, updatedDesc, updatedImageUrl, prodId);
  product.save()
    .then(() => {
      console.log(`CLOG "Updated product successfully": `, null);
      res.redirect('/admin/products')
    })
    .catch(err => console.log(`CLOG "err": `, err));
};

exports.getProducts = (req, res) => {
  Product.fetchAll()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
}

exports.postDeleteProduct = (req, res) => {
  const prodId = req.body["productId"];
  Product.deletebyId(prodId)
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log(`CLOG error while deleting the product with ID "${prodId}" "err": `, err));
};
