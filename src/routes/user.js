import express from 'express';

import user from './../controllers/user';


const router = express.Router();

router.route('/')
  .get(user.list)
  .post(user.create);

router.route('/:_id')
  .get(user.retrieve);

export default router;
