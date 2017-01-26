import { DEBUG } from './../config';

const errorCreator = (status = 500, message) => {
  const error = new Error();
  error.status = status;
  error.message = message;
  if (!DEBUG) error.stack = null;
  return error;
};

const internalServerError = (message = 'Internal Server Error') => errorCreator(500, message);
const notFound = (message = 'Not Found') => errorCreator(404, message);
const forbidden = (message = 'Forbidden') => errorCreator(403, message);
const unauthorized = (message = 'Unauthorized') => errorCreator(401, message);

export default { errorCreator, internalServerError, notFound, forbidden, unauthorized };
