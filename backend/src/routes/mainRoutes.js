import express from 'express';
import { authRouter } from './authRoutes.js';
import { userRouter } from './userRoutes.js';
import { chatRouter } from './chatRoutes.js';
import { messageRouter } from './messageRoutes.js';
import { notificationRouter } from './notificationRoutes.js';
import { cloudinaryRouter } from './cloudinaryRoutes.js';

const mainRouter = express.Router();

// auth routes
mainRouter.use('/auth', authRouter);

// user routes
mainRouter.use('/users', userRouter);

// chat routes
mainRouter.use('/chats', chatRouter);

// message routes
mainRouter.use('/messages', messageRouter);

// notification routes
mainRouter.use('/notifications', notificationRouter);

// cloudnary routes
mainRouter.use('/cloudinary', cloudinaryRouter);

export { mainRouter };
