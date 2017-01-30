import bluebird from 'bluebird';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Passport } from 'passport';
import LocalStrategy from 'passport-local';

import config from './../config';
import errors from './../helpers/errors';
import User from './../models/user';


bluebird.promisifyAll(crypto);
bluebird.promisifyAll(jwt);

const passport = new Passport();

// sign new JWT.
const signToken = (_id) => {
  const options = { expiresIn: config.jwt.expiresIn };
  return crypto.randomBytesAsync(16)
    .then(buf => jwt.signAsync({ _id, rdk: buf.toString('hex') }, config.jwt.secret, options));
};

// strategy for passport middleware.
const localStrategy = (username, password, done) => {
  let user;
  User.findOne({ username }).select('+password') // explicitly expose `password`.
    .catch(() => done(null, false, 'Incorrect username.'))
    .then((_user) => { user = _user; return user.validatePassword(password); })
    .catch(() => done(null, false, 'Incorrect password.'))
    .then(() => done(null, user));
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
    .catch(err => next(err))
    .then(token => res.json({ token }));
};

export default { create, refresh };
