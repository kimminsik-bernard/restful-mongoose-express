import bcrypt from 'bcrypt';

import { ENCRYPT } from './../config';
import User from './../models/user';
import errors from './../helpers/error';


const list = (req, res) => {
  User.find((err, users) => users)
    .then(users => res.json(users));
};

const create = (req, res, next) => {
  bcrypt.hash(req.body.password, ENCRYPT.saltRound).then((hash) => {
    const user = new User({
      username: req.body.username,
      password: hash,
    });
    user.save()
      .then(savedUser => res.json(savedUser))
      .catch(err => next(err));
  });
};

const retrieve = (req, res, next) => {
  const _id = req.params._id;
  User.findOne({ _id }, (err, user) => {
    if (err) return next(err);
    if (!user) return next(errors.notFound());
    return user;
  }).then((user) => {
    if (user) res.json(user);
  });
};

export default { list, create, retrieve };
