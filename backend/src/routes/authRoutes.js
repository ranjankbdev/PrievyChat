import express from 'express';
import { wrapAsync } from '../utils/wrapAsync.js';
import { signup, login, logout } from '../controllers/authController.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { signupSchema, loginSchema } from '../schemas/authSchema.js';

const authRouter = express.Router();

// signup
authRouter.post('/signup', validateSchema(signupSchema), wrapAsync(signup));

// login
authRouter.post('/login', validateSchema(loginSchema), wrapAsync(login));

// logout
authRouter.post('/logout', wrapAsync(logout));

export { authRouter };
