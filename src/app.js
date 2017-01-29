import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import config from './config';
import errors from './helpers/errors';
import routes from './routes';


const app = express();

// logging http requests.
if (config.env === 'development') app.use(morgan('dev'));

// protect server from request headers.
app.use(helmet());
// enable CORS.
app.use(cors());

// parsing request body.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// use routes
app.use('/api', routes);

// handle not found.
app.use((req, res, next) => {
  next(errors.notFound());
});

// respond errors.
app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.message,
  });
});

export default app;
