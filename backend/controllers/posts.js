const Post = require("../models/post");

exports.createPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId,
  });

  post.save().then((createdPost) => {
    res.status(201).json({
      message: 'Post added successfully!', post: {
        ...createdPost, _id: createdPost._id,
      }
    });
  }).catch(() => {
    res.status(500).json({
      message: 'Creating a post failed!',
    });
  });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;

  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }

  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId,
  });

  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post)
    .then(result => {
      if (result.modifiedCount > 0) {
        res.status(200).json({
          message: 'Updated successfully!'
        });
      } else {
        res.status(401).json({
          message: 'Not authorized!'
        });
      }
    }).catch(() => {
    res.status(500).json({
      message: 'Could not update a post',
    });
  });
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();

  let fetchedPosts;

  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  postQuery
    .then(posts => {
      fetchedPosts = posts;
      return Post.count();
    })
    .then(count => {
      return res.status(200).json({
        message: 'Posts fetched successfully!', posts: fetchedPosts, totalPostsNum: count,
      });
    }).catch(() => {
    res.status(500).json({
      message: 'Fetching posts failed!',
    });
  });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: 'Post not found!'
      });
    }
  }).catch(() => {
    res.status(500).json({
      message: 'Fetching posts failed!',
    });
  });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId})
    .then(result => {
      if (result.deletedCount > 0) {
        res.status(200).json({
          message: 'Post deleted!'
        });
      } else {
        res.status(401).json({
          message: 'Not authorized!'
        });
      }
    }).catch(() => {
    res.status(500).json({
      message: 'Deleting posts failed!',
    });
  });
};
