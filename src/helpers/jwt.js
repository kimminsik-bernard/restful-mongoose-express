import bluebird from 'bluebird';
import jwt from 'jsonwebtoken';


// promisify jsonwebtoken functions
const promisingSign = bluebird.promisify((payload, secret, options, callback) => {
  jwt.sign(payload, secret, options, (err, signed) => {
    if (err) return callback(err);
    return callback(null, signed);
  });
});

const promisingVerify = bluebird.promisify((token, secret, callback) => {
  jwt.verify(token, secret, (err, decoded) => {
    if (err) return callback(err);
    return callback(null, decoded);
  });
});

export default {
  sign: promisingSign,
  verify: promisingVerify,
};
