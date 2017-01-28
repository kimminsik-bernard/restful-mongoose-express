import jwt from 'jsonwebtoken';

import config from './../config';
import User from './../models/user';
import errors from './../helpers/error';


export const jwtMiddleware = () => (req, res, next) => {
  req.user = { isAnonymous: true };

  const handleError = (err, doc) => {
    if (err) return next(err);
    if (!doc) return next(errors.notFound());
    return doc;
  };

  const setUser = (user) => {
    req.user = user;
    next();
  };

  if (req.headers.authorization) {
    const verified = jwt.verify(req.headers.authorization, config.jwt.secret);
    User.findOne({ _id: verified._id })
      .then((err, user) => handleError(err, user))
      .then(user => setUser(user));
  }
  next();
};

export const authRequired = () => (req, res, next) => {
  if (req.user.isAnonymous) next(errors.unauthorized());
  next();
};
