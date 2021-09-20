exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        title: 'First Post',
        content: 'First Content',
      },
      {
        title: 'Second Post',
        content: 'Second Content',
      }
    ]
  });
}

exports.createPost = (req, res, next) => {
  const title = req.body['title'];
  const content = req.body['content'];

  // create post in db
  res.status(201).json({
    message: 'Post created successfully',
    post: {
      id: new Date().toISOString(),
      title, content,
    }
  })
}
