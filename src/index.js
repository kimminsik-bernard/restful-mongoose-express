import bluebird from 'bluebird';
import mongoose from 'mongoose';

import config from './config';
import app from './app';


// use ES6 Promise in mongoose.
mongoose.Promise = bluebird;

// connect mongoDB.
mongoose.connect(config.db.host, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${config.db.host}`);
});

// listen requests.
app.listen(config.port);
console.log(`App listening on port ${config.port}`);
