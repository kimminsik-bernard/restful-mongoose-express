import express from 'express';

import { authRequired } from './../middlewares/auth';
import user from './../controlers/user';


const router = express.Router();

router.route('/')
  .get(user.list)
  .post(user.create);

router.route('/:_id')
  .get(authRequired, user.retrieve)
  .patch(authRequired, user.update);

export default router;
