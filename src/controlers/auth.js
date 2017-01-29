import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import config from './../config';
import errors from '../helpers/errors';
import User from './../models/user';


// sign new JWT.
const signToken = (_id) => {
  const rdk = crypto.randomBytes(16).toString('base64');
  const options = { expiresIn: config.jwt.expiresIn };
  return jwt.sign({ _id, rdk }, config.jwt.secret, options);
};

// strategy for passport middleware.
const localStrategy = (username, password, done) => {
  let user;
  User.findOne({ username }).select('+password') // explicitly expose `password`.
    .then((_user) => {
      user = _user;
      user.validatePassword(password, handleValid); // validatePassword method returns a promise.
    })
    .catch(() => done(null, false, 'Incorrect username.')); // cannot find the doc with given username.

  function handleValid(valid) { // resolved validation
    if (!valid) return done(null, false, 'Incorrect password.');
    return done(null, user);
  }
};

// create JWT with passport middleware.
const create = (req, res, next) => {
  passport.use(new LocalStrategy(
    (username, password, done) => localStrategy(username, password, done),
  ));

  passport.authenticate('local', (err, user, info) => {
    const error = err || info;
    if (error) return next(errors.unauthorized(error));
    if (!user) return next(errors.notFound());

    const token = signToken(user._id);
    return res.json({ token, user });
  })(req, res, next);
};

// refresh JWT.
const refresh = (req, res, next) => {
  const token = signToken(req.user._id);
  return res.json({ token });
};

export default { create, refresh };
