const express = require('express');

const app = express();

app.use('/api/posts', (req, res, next) => {
  const posts = [
    {
      id: 'sdaklfjs',
      title: 'first post',
      content: 'this is coming from the server',
    },
    {
      id: 'sdaksderclfjs',
      title: 'second post',
      content: 'this is coming from the server',
    },
  ];
  return res.status(200).json({
    message: 'posts fetched successfully!',
    posts: posts,
  });
});

module.exports = app;
