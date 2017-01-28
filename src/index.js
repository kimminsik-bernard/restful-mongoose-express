import mongoose from 'mongoose';

import config from './config';
import app from './app';

mongoose.Promise = global.Promise;

mongoose.connect(config.db.host, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${config.db.host}`);
});

app.listen(config.port);
console.log(`App listening on port ${config.port}`);
