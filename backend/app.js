const express = require('express');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
})

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
