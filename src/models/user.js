import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import config from './../config';
import timestamp from './plugins/timestamp';

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
    match: /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

function validatePassword(password) {
  return bcrypt.compare(password, this.password)
    .then(result => result)
    .catch(() => false);
}

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

User.method({
  validatePassword,
  setPassword,
});

User.plugin(timestamp);

export default mongoose.model('User', User);
