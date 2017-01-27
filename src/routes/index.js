import express from 'express';

import authRoutes from './auth';
import userRoutes from './user';
import { jwtMiddleware } from './../middlewares/auth';


const router = express.Router();

router.use(jwtMiddleware());

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
