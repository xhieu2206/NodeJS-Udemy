const { validationResult } = require('express-validator');
const Product = require('../models/product');
const { deleteFile } = require('../util/file');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  /* đây là một cách để protecting routes, tuy nhiên cách này rất 'cồng kềnh' và RYS, do đó chúng ta sẽ sử dụng một thứ gọi là middleware
    if (!req.session.isLoggedIn) {
      return res.redirect('/login');
    }
   */
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  if (!image) {
    return res.status(422).render('admin/add-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: { title, price, description },
      errorMessage: 'Attached file is not an image',
      validationErrors: [],
    });
  }

  const imageUrl = image.path;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/add-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: { title, imageUrl: image, price, description },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl,
    userId: req.session.user
  });
  product
    .save()
    .then(() => {
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(() => {
      /*
        return res.status(500).render('admin/edit-product', {
          pageTitle: 'Add Product',
          path: '/admin/add-product',
          editing: false,
          hasError: true,
          product: { title, imageUrl, price, description },
          errorMessage: 'Database operation failed, please try again.',
          validationErrors: [],
        })
      */
      const error = new Error();
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query['edit'];
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch(() => {
      const error = new Error();
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImage = req.file;
  const updatedDesc = req.body.description;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDesc,
        _id: prodId,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  Product.findById(prodId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      if (updatedImage) {
        deleteFile(product.imageUrl);
        product.imageUrl = updatedImage.path;
      }
      return product.save()
        .then(() => {
          console.log('UPDATED PRODUCT!');
          res.redirect('/admin/products');
        })
    })
    .catch(() => {
      const error = new Error();
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product
    .find({
      userId: req.user._id
    })
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch(() => {
      const error = new Error();
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.params['productId'];

  Product
    .findById(prodId)
    .then(product => {
      if (!product) {
        return next(new Error('Product not found!!!'));
      }
      deleteFile(product.imageUrl);
      return Product.deleteOne({
        _id: prodId,
        userId: req.user._id,
      });
    })
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.status(200).json({
        message: 'Success',
      });
    })
    .catch(() => {
      res.status(500).json({
        message: 'Deleting product failed!!!',
      });
    });
};
