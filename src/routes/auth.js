import express from 'express';

import { authRequired } from './../middlewares/auth';
import auth from './../controlers/auth';


const router = express.Router();

router.route('/')
  .post(auth.create);

router.route('/refresh')
  .get(authRequired, auth.refresh);

export default router;
