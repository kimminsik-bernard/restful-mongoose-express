import bcrypt from 'bcrypt';

import config from './../config';
import User from './../models/user';


// list users.
const list = (req, res, next) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => next(err));
};

// create new user.
const create = (req, res, next) => {
  // hashing password with bcrypt
  bcrypt.hash(req.body.password, config.bcrypt.saltRound)
    .then(hash => createUser(req.body.username, hash));

  // create new user document with hashed password.
  function createUser(username, password) {
    const user = new User({
      username, password,
    });
    return user.save()
      .then(savedUser => res.json({
        _id: savedUser._id,
        username: savedUser.username,
      }))
      .catch(err => next(err));
  }
};

// retrieve user document
const retrieve = (req, res, next) => {
  const _id = req.params._id;

  return User.findById(_id)
    .then(doc => res.json(doc))
    .catch(err => next(err));
};

export default { list, create, retrieve };
