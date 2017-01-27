import express from 'express';

import auth from './../controllers/auth';
import { authRequired } from './../middlewares/auth';


const router = express.Router();

router.route('/')
  .post(auth.create);

router.route('/validate')
  .get(authRequired, auth.validate);

export default router;
