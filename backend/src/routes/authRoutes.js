import express from 'express';
import { wrapAsync } from '../utils/wrapAsync.js';
import {
  signup,
  login,
  logout,
  sendPasswordResetOtp,
  verifyPasswordResetOtp,
  resetUserPassword,
} from '../controllers/authController.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import {
  signupSchema,
  loginSchema,
  sendPasswordResetOtpSchema,
  verifyPasswordResetOtpSchema,
  resetUserPasswordSchema,
} from '../schemas/authSchema.js';

const authRouter = express.Router();

authRouter.post('/signup', validateSchema(signupSchema), wrapAsync(signup));

authRouter.post('/login', validateSchema(loginSchema), wrapAsync(login));

authRouter.post('/logout', wrapAsync(logout));

authRouter.post(
  '/password-reset/otp',
  validateSchema(sendPasswordResetOtpSchema),
  wrapAsync(sendPasswordResetOtp)
);

authRouter.post(
  '/password-reset/verify',
  validateSchema(verifyPasswordResetOtpSchema),
  wrapAsync(verifyPasswordResetOtp)
);

authRouter.post(
  '/password-reset',
  validateSchema(resetUserPasswordSchema),
  wrapAsync(resetUserPassword)
);

export { authRouter };
