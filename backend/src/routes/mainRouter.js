import express from 'express';
import { authRouter } from './authRoutes.js';

const mainRouter = express.Router();

// auth routes
mainRouter.use('/auth', authRouter);

export { mainRouter };
