import mongoose from 'mongoose';

import { DB, PORT } from './config';
import app from './app';

mongoose.Promise = global.Promise;

mongoose.connect(DB, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${DB}`);
});

app.listen(PORT);
console.log(`App listening on port ${PORT}`);
