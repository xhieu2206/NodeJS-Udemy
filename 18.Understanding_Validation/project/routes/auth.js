const express = require('express');
const { check } = require('express-validator/check');
/* check() sẽ return về một middleware, và chúng ta có thể chain các middleware này với nhau */
const router = express.Router();

const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

/* chúng ta sẽ truyền vào name của field mà chúng ta quan tâm, và method chúng ta muốn apply lên field đó để validation */
router.post('/signup', check('email').isEmail(), authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/new-password/:token', authController.getNewPassword);

router.post('/new-password/', authController.postNewPassword);

module.exports = router;
