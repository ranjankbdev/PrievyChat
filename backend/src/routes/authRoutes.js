import express from 'express';
import rateLimit from 'express-rate-limit';
import { wrapAsync } from '../utils/wrapAsync.js';
import {
  signup,
  login,
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

// authlimiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many requests, please try again later',
});

const authRouter = express.Router();

authRouter.post('/signup', authLimiter, validateSchema(signupSchema), wrapAsync(signup));

authRouter.post('/login', authLimiter, validateSchema(loginSchema), wrapAsync(login));

authRouter.post(
  '/password-reset/otp',
  authLimiter,
  validateSchema(sendPasswordResetOtpSchema),
  wrapAsync(sendPasswordResetOtp)
);

authRouter.post(
  '/password-reset/verify',
  authLimiter,
  validateSchema(verifyPasswordResetOtpSchema),
  wrapAsync(verifyPasswordResetOtp)
);

authRouter.post(
  '/password-reset',
  authLimiter,
  validateSchema(resetUserPasswordSchema),
  wrapAsync(resetUserPassword)
);

export { authRouter };
