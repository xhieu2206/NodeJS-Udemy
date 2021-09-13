const express = require('express');
const { check, body } = require('express-validator');
/* check() sẽ return về một middleware, và chúng ta có thể chain các middleware này với nhau */
const router = express.Router();

const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

/* chúng ta sẽ truyền vào name của field mà chúng ta quan tâm, và method chúng ta muốn apply lên field đó để validation */
router.post('/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom((value, {req}) => {
        if (value === 'test@test.com') {
          throw new Error('This email address is not allow');
        }
        /* return true nếu như chúng ta success, nếu không chúng ta sẽ luôn failed the validation */
        return true;
      }),
    /* `body` nghĩa là chỉ look for params ở body, `check` sẽ tìm kiếm ở tất cả mọi nơi. Đây là 1 cách khác để thiết đặt error message */
    body('password', 'Please enter a password with only numbers and text and at least 5 characters')
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!!!');
        }
        return true;
      })
  ],
  authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/new-password/:token', authController.getNewPassword);

router.post('/new-password/', authController.postNewPassword);

module.exports = router;
