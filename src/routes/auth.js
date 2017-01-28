import express from 'express';

import { authRequired } from './../middlewares/auth';
import auth from './../controllers/auth';


const router = express.Router();

router.route('/')
  .post(auth.create);

router.route('/validate-token')
  .get(authRequired(), auth.validateToken);

export default router;
