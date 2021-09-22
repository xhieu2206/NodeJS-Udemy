const express = require('express');
const feedController = require('../controllers/feed');
const { body } = require('express-validator/check');

const router = express.Router();
const isAuth = require('../middleware/isAuth');

router.get('/posts', isAuth, feedController.getPosts);

router.post('/post', [
  body('title').trim().isLength({ min: 5 }),
  body('content').trim().isLength({ min: 5 }),
], isAuth, feedController.createPost);

router.get('/post/:postId', isAuth, feedController.getPost);

router.put('/post/:postId', isAuth, [
  body('title').trim().isLength({ min: 5 }),
  body('content').trim().isLength({ min: 5 }),
], feedController.updatePost);

router.delete('/post/:postId', isAuth, feedController.deletePost)

module.exports = router;
