const { validationResult } = require('express-validator');

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

  // create post in db
  res.status(201).json({
    message: 'Post created successfully',
    post: {
      _id: new Date().toISOString(),
      title,
      content,
      creator: {
        name: 'xhieu2206'
      },
      createdAt: new Date()
    }
  })
}
