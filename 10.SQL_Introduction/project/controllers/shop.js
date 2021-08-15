const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res) => {
  Product.fetchAll()
    .then(([rows]) => {
      res.render('shop/product-list', {
        products: rows,
        pageTitle: 'Products',
        path: '/products'
      });
    })
    .catch(() => {
      console.log('Eror while fetching the products');
    });
}

exports.getProduct = (req, res) => {
  const prodId = req.params['productId'];
  Product.findById(prodId)
    .then(([products]) => {
      console.log(`CLOG "products[0]": `, products[0]);
      res.render('shop/product-detail', {
        product: products[0],
        pageTitle: 'Product Title',
        path: '/products'
      });
    })
    .catch(e => console.log('Error while fetching product', e));
}

exports.getIndex = (req, res) => {
  Product.fetchAll()
    .then(([rows]) => {
      res.render('shop/product-list', {
        products: rows,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(() => {
      console.log('Eror while fetching the products');
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
  const prodId = req.body['productId'] ;
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
