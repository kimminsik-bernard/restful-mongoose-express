import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import helmet from 'helmet';

import errors from './helpers/error';
import routes from './routes';


const app = express();

app.use(morgan('dev'));

app.use(helmet());
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes);

app.use((req, res, next) => {
  next(errors.notFound());
});

app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.message,
  });
});

export default app;
