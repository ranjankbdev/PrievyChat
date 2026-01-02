import express from 'express';
import { wrapAsync } from '../utils/wrapAsync.js';
import { signup, login } from '../controllers/authController.js';

const authRouter = express.Router();

// signup route
authRouter.post('/signup', wrapAsync(signup));

// login route
authRouter.post('/login',wrapAsync(login));

export { authRouter };
