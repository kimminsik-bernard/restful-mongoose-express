import bcrypt from 'bcrypt';

import config from './../config';
import User from './../models/user';
import errors from './../helpers/error';


const list = (req, res, next) => {
  User.find((err, users) => users)
    .then(users => res.json(users));
};

const create = (req, res, next) => {
  const createUser = (username, password) => {
    const user = new User({
      username, password,
    });
    user.save()
      .then(savedUser => res.json(savedUser))
      .catch(err => next(err));
  };

  bcrypt.hash(req.body.password, config.bcrypt.saltRound)
    .then(hash => createUser(req.body.username, hash));
};

const retrieve = (req, res, next) => {
  const _id = req.params._id;
  const handleError = (err, doc) => {
    if (err) return next(err);
    if (!doc) return next(errors.notFound());
    return doc;
  };

  User.findOne({ _id })
    .then((err, doc) => handleError(err, doc))
    .then(user => res.json(user));
};

export default { list, create, retrieve };
