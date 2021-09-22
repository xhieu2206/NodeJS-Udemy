const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation Failed');
    error.statusCode = 422;
    error.data = error.array();
    throw error;
  }

  const email = req.body['email'];
  const name = req.body['name'];
  const password = req.body['password'];
  bcrypt.hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email, password: hashedPassword, name,
      })
      return user.save();
    })
    .then(result => {
      res.status(201).json({
        message: 'User created',
        userId: result._id,
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  User.findOne({ email })
    .then(user => {
      if (!user) {
        const error = new Error('User with this email could not be found');
        error.satusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password)
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('Wrong Password');
        error.satusCode = 401;
        throw error;
      }
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}
