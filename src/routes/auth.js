import express from 'express';

import auth from './../controllers/auth';


const router = express.Router();

router.route('/')
  .post(auth.create);

router.route('/validate')
  .get(auth.validate);

export default router;
