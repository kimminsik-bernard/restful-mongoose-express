import jwt from 'jsonwebtoken';

import config from './../config';
import User from './../models/user';
import errors from './../helpers/error';


export const jwtMiddleware = () => (req, res, next) => {
  req.user = { isAnonymous: true };

  const setUser = (user) => {
    req.user = user;
    next();
  };

  if (req.headers.authorization) {
    const verified = jwt.verify(req.headers.authorization, config.jwt.secret);
    User.findById(verified._id)
      .then(user => setUser(user))
      .catch(err => next(err));
  } else {
    next();
  }
};

export const authRequired = () => (req, res, next) => {
  if (req.user.isAnonymous) next(errors.unauthorized());
  next();
};
