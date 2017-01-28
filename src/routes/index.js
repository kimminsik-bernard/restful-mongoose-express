import express from 'express';

import authRoutes from './auth';
import userRoutes from './user';
import { jwtMiddleware } from './../middlewares/auth';


const router = express.Router();

// handle JWT in the request headers.
router.use(jwtMiddleware());

router.get('/', (req, res, next) => {
  res.send('Hello World!');
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
