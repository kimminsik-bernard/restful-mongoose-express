import { Passport } from 'passport';
import LocalStrategy from 'passport-local';

import config from './../config';
import crypto from './../helpers/crypto';
import errors from './../helpers/errors';
import jwt from './../helpers/jwt';
import User from './../models/user';

const passport = new Passport();

// sign new JWT.
const signToken = (_id) => {
  const options = { expiresIn: config.jwt.expiresIn };
  return crypto.randomBytes(16)
    .then(buf => jwt.sign({ _id, rdk: buf.toString('hex') }, config.jwt.secret, options));
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

  passport.authenticate('local', (_err, user, info) => {
    const error = _err || info;
    if (error) return next(errors.unauthorized(error));
    if (!user) return next(errors.notFound());

    return signToken(user._id)
      .then(token => res.json({ token, user }))
      .catch(err => next(err));
  })(req, res, next);
};

// refresh JWT.
const refresh = (req, res, next) => {
  const _id = req.user._id;
  return signToken(_id)
    .then(token => res.json({ token }))
    .catch(err => next(err));
};

export default { create, refresh };
