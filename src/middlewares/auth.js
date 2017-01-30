import bluebird from 'bluebird';
import jwt from 'jsonwebtoken';

import config from './../config';
import errors from '../helpers/errors';


bluebird.promisifyAll(jwt);

// verify JWT in the headers and assign decoded information to the request.
export const jwtMiddleware = (req, res, next) => {
  if (req.headers.authorization) {
    jwt.verifyAsync(req.headers.authorization, config.jwt.secret)
      .catch(() => next(errors.unauthorized()))
      .then((decoded) => { req.user = decoded; next(); });
  } else {
    next();
  }
};

// require authentication.
export const authRequired = (req, res, next) => {
  if (!req.user) next(errors.unauthorized());
  next();
};
