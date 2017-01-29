import jwt from 'jsonwebtoken';

import config from './../config';
import errors from '../helpers/errors';


// verify JWT in the headers and assign decoded information to the request.
export const jwtMiddleware = (req, res, next) => {
  if (req.headers.authorization) {
    jwt.verify(req.headers.authorization, config.jwt.secret, (err, decoded) => {
      if (err) next(errors.unauthorized());
      req.user = decoded;
      next();
    });
  } else {
    next();
  }
};

// require authentication.
export const authRequired = (req, res, next) => {
  if (!req.user) next(errors.unauthorized());
  next();
};
