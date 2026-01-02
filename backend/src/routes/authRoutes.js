import express from 'express';
import { wrapAsync } from '../utils/wrapAsync.js';
import { signup, login } from '../controllers/authController.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { signupSchema, loginSchema } from '../schemas/authSchema.js';

const authRouter = express.Router();

// signup route
authRouter.post('/signup', validateSchema(signupSchema), wrapAsync(signup));

// login route
authRouter.post('/login', validateSchema(loginSchema), wrapAsync(login));

export { authRouter };
