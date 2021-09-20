const { validationResult } = require('express-validator');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: '123',
        title: 'First Post',
        content: 'First Content',
        imageUrl: 'images/ga-2100hc-2a_b033ce08dc9147c28bd6eea207a62432_large.png',
        creator: {
          name: 'xhieu2206',
        },
        createdAt: new Date(),
      },
    ]
  });
}

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({
        message: 'Validation failed, enterd data is incorrect.',
        errors: errors.array(),
      });
  }

  const title = req.body['title'];
  const content = req.body['content'];
  const post = new Post({
    title,
    content,
    imageUrl: 'images/ga-2100hc-2a_b033ce08dc9147c28bd6eea207a62432_large.png',
    creator: {
      name: 'xhieu2206'
    },
  });
  post
    .save()
    .then(post => {
      console.log('CREATED SUCCESSFULLY!!!');
      res.status(201).json({
        message: 'Post created successfully',
        post
      });
    })
    .catch(err => console.log(err));
}
