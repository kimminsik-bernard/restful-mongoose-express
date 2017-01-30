import bluebird from 'bluebird';
import crypto from 'crypto';


// promisify crypto functions
const promisingRandomBytes = bluebird.promisify((byte, callback) => {
  crypto.randomBytes(16, (err, buf) => {
    if (err) return callback(err);
    return callback(null, buf);
  });
});

export default {
  randomBytes: promisingRandomBytes,
};
