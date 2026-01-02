import express from 'express';
import { wrapAsync } from '../utils/wrapAsync.js';
import { getAllUsers, getUserById, updateUserProfile } from '../controllers/userController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const userRouter = express.Router();

// get logged-in user details
userRouter.get('/me', verifyToken, wrapAsync(getUserById));

// get all users except logged-in user
userRouter.get('/', verifyToken, wrapAsync(getAllUsers));

// update user profile (name and picture)
userRouter.put('/me', verifyToken, wrapAsync(updateUserProfile));

export { userRouter };
