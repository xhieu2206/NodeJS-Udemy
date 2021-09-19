const path = require('path');

const express = require('express');
const { body } = require('express-validator');
const adminController = require('../controllers/admin');

const router = express.Router();
const isAuth = require('../middleware/is-auth');

// /admin/add-product => GET
/* traveler từ left to right, do đó chúng ta có thể put middleware vào giữa */
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', [
  body('title').isString().isLength({ min: 3 }).trim(),
  body('price').isFloat(),
  body('description').trim().isLength({ min: 5, max: 200 })
], isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', [
  body('title').isString().isLength({ min: 3 }).trim(),
  body('price').isFloat(),
  body('description').trim().isLength({ min: 5, max: 200 })
], isAuth, adminController.postEditProduct);

router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;
