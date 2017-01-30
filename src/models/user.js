import bcrypt from 'bcrypt';
import bluebird from 'bluebird';
import mongoose from 'mongoose';

import config from './../config';
import timestamp from './plugins/timestamp';


// User schema
const User = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    dropDup: true,
  },
  password: {
    type: String,
    select: false,
  },
  email: {
    type: String,
    match: /^([\w-]+@([\w-]+\.)+[\w-]{2,4})?$/,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

// validate password.
function validatePassword(password, callback) {
  return bcrypt.compare(password, this.password)
    .catch(err => callback(err, false))
    .then(result => callback(null, result));
}

// set new password.
function setPassword(password, callback) {
  bcrypt.hash(password, config.bcrypt.saltRound)
    .then(hash => savePassword(hash));

  function savePassword(pass) {
    this.password = pass;
    return this.save()
      .catch(err => callback(err, null))
      .then(savedUser => callback(null, savedUser));
  }
}

// add custom methods.
User.method({
  validatePassword: bluebird.promisify(validatePassword),
  setPassword: bluebird.promisify(setPassword),
});

// add custom plugins.
User.plugin(timestamp);

export default mongoose.model('User', User);
