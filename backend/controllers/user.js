const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10,)
    .then(hash => {
      const user = new User({
        email: req.body.email, password: hash,
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User created!', result: result,
          });
        })
        .catch(() => {
          res.status(500).json({
            message: 'This email is already taken!',
          });
        });
    });
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;

  User.findOne({email: req.body.email})
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Auth failed',
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Invalid credentials!',
        });
      }
      const token = jwt.sign({
        email: fetchedUser.email,
        userId: fetchedUser._id
      }, 'secret_this_should_be_longer', {expiresIn: '1h'});
      res.status(200).json({
        token: token, expiresIn: 3600, message: 'Successfully authenticated', userId: fetchedUser._id,
      })
    })
    .catch(() => {
      return res.status(401).json({
        message: 'Invalid credentials!',
      });
    });
};
