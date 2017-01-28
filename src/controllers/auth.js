import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import jwt from 'jsonwebtoken';

import config from './../config';
import errors from './../helpers/error';
import User from './../models/user';


const signToken = _id => jwt.sign({ _id }, config.jwt.secret);

const localStrategy = (username, password, done) => {
  User.findOne({ username }, (err, user) => {
    if (err) return done(err);
    if (!user) return done(null, false, { message: 'Incorrect username.' });
    if (!user.validPassword(password)) return done(null, false, { message: 'Incorrect password.' });
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

    const token = signToken(user.id);
    return res.json({ token });
  })(req, res, next);
};

const validateToken = (req, res, next) => {
  res.json({
    _id: req.user._id,
  });
};

export default { create, validateToken };
