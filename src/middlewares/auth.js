import jwt from 'jsonwebtoken';

import config from './../config';
import errors from './../helpers/error';


export const jwtMiddleware = () => (req, res, next) => {
  if (req.headers.authorization) {
    jwt.verify(req.headers.authorization, config.jwt.secret, (err, decoded) => {
      if (err) next(errors.unauthorized());
      req.user = decoded;
      next();
    });
  } else {
    req.user = { isAnonymous: true };
    next();
  }
};

export const authRequired = () => (req, res, next) => {
  if (req.user.isAnonymous) next(errors.unauthorized());
  next();
};
