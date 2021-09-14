const path = require('path');

const express = require('express');
const { body } = require('express-validator');
const adminController = require('../controllers/admin');

const router = express.Router();
const isAuth = require('../middleware/is-auth');

// /admin/add-product => GET
/* traveler từ left to right, do đó chúng ta có thể put middleware vào giữa */
router.get('/add-product', [
  body('title').isAlphanumeric().isLength({ min: 3 }).trim(),
  body('imageUrl').isURL(),
  body('price').isFloat(),
  body('description').trim().isLength({ min: 5, max: 200 })
], isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', [
  body('title').isString().isLength({ min: 3 }).trim(),
  body('imageUrl').isURL(),
  body('price').isFloat(),
  body('description').trim().isLength({ min: 5, max: 200 })
], isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', [
  body('title').isString().isLength({ min: 3 }).trim(),
  body('imageUrl').isURL(),
  body('price').isFloat(),
  body('description').trim().isLength({ min: 5, max: 200 })
], isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
