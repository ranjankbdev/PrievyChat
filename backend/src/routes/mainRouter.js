import express from 'express';
import { authRouter } from './authRoutes.js';
import { userRouter } from './userRoutes.js';

const mainRouter = express.Router();

// auth routes
mainRouter.use('/auth', authRouter);

// user routes
mainRouter.use('/users', userRouter);

export { mainRouter };
