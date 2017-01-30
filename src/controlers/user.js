import bcrypt from 'bcrypt';
import bluebird from 'bluebird';

import config from './../config';
import User from './../models/user';


bluebird.promisifyAll(bcrypt);

// list users.
const list = (req, res, next) => {
  User.find()
    .catch(err => next(err))
    .then(users => res.json(users));
};

// create new user.
const create = (req, res, next) => {
  // hashing password with bcrypt
  bcrypt.hashAsync(req.body.password, config.bcrypt.saltRound)
    .then(hash => createUser(req.body.username, hash));

  // create new user document with hashed password.
  function createUser(username, password) {
    const user = new User({
      username, password,
    });
    return user.save()
      .catch(err => next(err))
      .then(savedUser => res.json(savedUser));
  }
};

// retrieve user document
const retrieve = (req, res, next) => {
  const _id = req.params._id;

  return User.findById(_id)
    .catch(err => next(err))
    .then(doc => res.json(doc));
};

export default { list, create, retrieve };
