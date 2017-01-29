import bcrypt from 'bcrypt';
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
function validatePassword(password) {
  return bcrypt.compare(password, this.password)
    .then(result => result)
    .catch(() => false);
}

// set new password.
function setPassword(password) {
  bcrypt.hash(password, config.bcrypt.saltRound)
    .then(hash => savePassword(hash));

  function savePassword(pass) {
    this.password = pass;
    return this.save()
      .then(savedUser => ((null, savedUser)))
      .catch(err => err);
  }
}

// add custom methods.
User.method({
  validatePassword,
  setPassword,
});

// add custom plugins.
User.plugin(timestamp);

export default mongoose.model('User', User);
