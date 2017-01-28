import jwt from 'jsonwebtoken';

import config from './../config';
import User from './../models/user';
import errors from './../helpers/error';


export const jwtMiddleware = () => (req, res, next) => {
  req.user = { isAnonymous: true };

  const handleError = (doc, err) => {
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
    User.findById(verified._id)
      .then((doc, err) => handleError(doc, err))
      .then(user => setUser(user));
  } else {
    next();
  }
};

export const authRequired = () => (req, res, next) => {
  if (req.user.isAnonymous) next(errors.unauthorized());
  next();
};
