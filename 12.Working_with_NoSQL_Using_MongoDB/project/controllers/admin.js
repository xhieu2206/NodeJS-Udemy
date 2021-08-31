const Product = require('../models/product');

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
  /*
    Sử dụng method mà Sequelize tự động generate chop chúng ta, ở đây là method `createProduct` (đọc doc)
   */
  req.user.createProduct({
    title, imageUrl, price, description
  })
    .then(result => {
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(`CLOG "err": `, err);
    });
};

// exports.getEditProduct = (req, res) => {
//   const editMode = req.query["edit"];
//   if (!editMode) {
//     return res.redirect('/');
//   }
//   const prodId = req.params["productId"];
//   /*
//     Sử dụng method `getProducts` được Sequelize defined
//    */
//   req.user
//     .getProducts({
//       where: {
//         id: prodId
//       }
//     })
//     .then(products => {
//       if (!products[0]) {
//         return res.redirect('/');
//       }
//       res.render('admin/edit-product', {
//         pageTitle: 'Edit Product',
//         path: '/admin/edit-product',
//         editing: editMode,
//         product: products[0]
//       });
//     })
//     .catch(err => console.log(`CLOG error while getting the product with ID "${prodId}" "err": `, err));
//   /*
//     Product
//       .findByPk(prodId)
//       .then(product => {
//         if (!product) {
//           return res.redirect('/');
//         }
//         res.render('admin/edit-product', {
//           pageTitle: 'Edit Product',
//           path: '/admin/edit-product',
//           editing: editMode,
//           product: product
//         });
//       })
//       .catch(err => console.log(`CLOG error while getting the product with ID "${prodId}" "err": `, err));
//    */
// };
//
// exports.postEditProduct = (req, res) => {
//   const prodId = req.body['productId'];
//   const updatedTitle = req.body.title;
//   const updatedPrice = req.body.price;
//   const updatedImageUrl = req.body.imageUrl;
//   const updatedDesc = req.body.description;
//   Product
//     .findByPk(prodId)
//     .then(p => {
//       if (!p) {
//         res.redirect('/admin/products');
//       } else {
//         p.title = updatedTitle;
//         p.price = updatedPrice;
//         p.imageUrl = updatedImageUrl;
//         p.description = updatedDesc;
//         return p.save();
//       }
//     })
//     .then(() => {
//       console.log(`CLOG "Updated product successfully": `, null);
//       res.redirect('/admin/products')
//     })
//     .catch(err => console.log(`CLOG "err": `, err))
//   /*
//     Product
//       .update({
//         title: updatedTitle,
//         imageUrl: updatedImageUrl,
//         description: updatedDesc,
//         price: updatedPrice
//       }, {
//         where: {
//           id: prodId
//         }
//       })
//       .then(() => {
//         res.redirect('/admin/products');
//       })
//       .catch(err => console.log(`CLOG error while updating the product with ID "${prodId}" "err": `, err));
//    */
// };
//
// exports.getProducts = (req, res) => {
//   req.user
//     .getProducts()
//     .then(products => {
//       res.render('admin/products', {
//         prods: products,
//         pageTitle: 'Admin Products',
//         path: '/admin/products'
//       });
//     })
//     .catch(err => console.log(`CLOG error when getting all products "err": `, err));
//
//   /*
//     Product
//       .findAll()
//       .then(products => {
//         res.render('admin/products', {
//           prods: products,
//           pageTitle: 'Admin Products',
//           path: '/admin/products'
//         });
//       })
//       .catch(err => console.log(`CLOG error when getting all products "err": `, err));
//    */
// };
//
// exports.postDeleteProduct = (req, res) => {
//   const prodId = req.body["productId"];
//   Product
//     .destroy({
//       where: {
//         id: prodId
//       }
//     })
//     .then(() => {
//       res.redirect('/admin/products');
//     })
//     .catch(err => console.log(`CLOG error while deleting the product with ID "${prodId}" "err": `, err));
// };
