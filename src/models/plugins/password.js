import bcrypt from 'bcrypt';
import config from './../../config';


const passwordPlugin = (schema) => {
  // hash password before saving it.
  schema.pre('save', function (next) {
    bcrypt.hash(this.password, config.bcrypt.saltRound)
      .then((hash) => { this.password = hash; return next(); });
  });
};

export default passwordPlugin;
