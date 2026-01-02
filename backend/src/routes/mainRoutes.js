import express from 'express';
import { authRouter } from './authRoutes.js';
import { userRouter } from './userRoutes.js';
import { chatRouter } from './chatRoutes.js';

const mainRouter = express.Router();

// auth routes
mainRouter.use('/auth', authRouter);

// user routes
mainRouter.use('/users', userRouter);

// chat routes
mainRouter.use('/chats', chatRouter);

export { mainRouter };
