const express = require('express');
const path = require('path');

const rootDir = require('../util/path');
const router = express.Router();

/* NOT DOING LIKE THAT ANYMORE
  router.get('/add-product', (req, res, next) => {
    console.log('In "Add Product" page');
    res.send(`
      <form action="/admin/products" method="POST">
        <input type="text" name="title" />
        <button type="Submit">Add</button>
      </form>
    `)
  });

  router.post('/products', (req, res) => {
    console.log(req.body);
    res.redirect('/');
  });
 */

router.get('/add-product', (req, res, next) => {
  console.log('In "Add Product" page');
  /* sử dụng rootDir thay thế cho cách cũ, không dùng cách này nữa.
    res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));
   */
  res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

router.post('/products', (req, res) => {
  console.log(req.body);
  res.redirect('/');
});

module.exports = router;
