import crypto from 'crypto';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import jwt from 'jsonwebtoken';

import config from './../config';
import errors from './../helpers/error';
import User from './../models/user';


const signToken = (_id) => {
  const rdk = crypto.randomBytes(16).toString('base64');
  const options = { expiresIn: config.jwt.expiresIn };
  return jwt.sign({ _id, rdk }, config.jwt.secret, options);
};

const localStrategy = (username, password, done) => {
  let user;
  User.findOne({ username }).select('+password')
    .then((doc) => {
      user = doc;
      return doc.validatePassword(password);
    })
    .catch(() => done(null, false, 'Incorrect username.'))
    .then((valid) => {
      if (!valid) return done(null, false, 'Incorrect password.');
      return done(null, user);
    });
};

const create = (req, res, next) => {
  passport.use(new LocalStrategy(
    (username, password, done) => localStrategy(username, password, done),
  ));

  passport.authenticate('local', (err, user, info) => {
    const error = err || info;
    if (error) return next(errors.unauthorized(error));
    if (!user) return next(errors.notFound());

    const token = signToken(user._id);
    return res.json({ token });
  })(req, res, next);
};

const refresh = (req, res, next) => {
  const token = signToken(req.user._id);
  return res.json({ token });
};

export default { create, refresh };
