import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import { ENCRYPT } from './../config';
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

function validPassword(password) {
  return bcrypt.compare(password, this.password).then(result => result);
}

function setPassword(password) {
  bcrypt.hash(password, ENCRYPT.saltRound)
    .then((hash) => { this.password = hash; });
  return this.save().then(user => user);
}

User.method({
  validPassword,
  setPassword,
});

User.plugin(timestamp);

export default mongoose.model('User', User);
