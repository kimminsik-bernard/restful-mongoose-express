import jwt from 'jsonwebtoken';

import { JWT_SECRET } from './../config';
import User from './../models/user';


const jwtMiddleware = () => {
  const middleware = (req, res, next) => {
    if (req.headers.authorization) {
      const verified = jwt.verify(req.headers.authorization, JWT_SECRET);
      User.findOne({ _id: verified._id }, (err, user) => {
        if (!user) return { isAnonymous: true };
        return user;
      }).then((user) => {
        req.user = user;
        next();
      });
    } else {
      req.user = { isAnonymous: true };
      next();
    }
  };
  return middleware;
};

export default jwtMiddleware;
