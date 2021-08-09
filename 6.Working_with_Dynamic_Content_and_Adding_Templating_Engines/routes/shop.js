const express = require('express');
const path = require('path');

const router = express.Router();
const rootDir = require('./../util/path');
const adminData = require('./admin');

/* NOT DOING LIKE THAT ANYMORE
router.get('/', (req, res, next) => {
  res.send(`<h1>Hello from Express.js</h1>`)
});
 */

router.get('/', (req, res, next) => {
  const products = adminData.products;

  /* Using rootDir for replacement
    res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
   */

  /* thay thế cho render .html file truyền thống
    res.sendFile(path.join(rootDir, 'views', 'shop.html'));
   */

  /* use with PUG view engine
    res.render('shop', { products, pageTitle: 'Shop', path: '/' }); // passing data ra bên ngoài PUG view
   */

  res.render('shop', {
    products, pageTitle: 'Shop',
    path: '/',
    hasProducts: products.length > 0,
    activeShop: true,
    productCss: true
  }); // passing data ra bên ngoài handlebars view
});

module.exports = router;
