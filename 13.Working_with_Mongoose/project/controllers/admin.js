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
  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user // nhờ có mongoose, sẽ chỉ có _id sẽ được pick để làm reference (thay vì userId = req.user._id)
  });
  product
    .save() // method đến từ mongoose, thay vì ta phải tạo lại từ đầu
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

  Product.findById(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then(product => {
      console.log('UPDATED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err))
}
exports.getProducts = (req, res) => {
  Product.find()
    // .populate('userId') // là một method của mongoose để populate a certain field với detail information chứ không chỉ có id, như ở đây chúng ta muốn lấy cả thông tin của User. Tham khảo thêm cả method `select` để control những fileds mà chúng ta muốn lấy về khi fetching data với mongoose
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
  Product.findByIdAndRemove(prodId)
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(`CLOG error while deleting the product with ID "${prodId}" "err": `, err));
};
