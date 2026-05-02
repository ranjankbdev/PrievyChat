import Joi from 'joi';
import { nameField, emailField, passwordField, otpField } from './baseSchema.js';

const signupSchema = Joi.object({
  body: Joi.object({
    name: nameField.required(),
    email: emailField.required(),
    picture: Joi.string().uri().optional().allow('', null),
    password: passwordField.required(),
  }).required(),
});

const loginSchema = Joi.object({
  body: Joi.object({
    email: emailField.required(),
    password: passwordField.required(),
  }).required(),
});

const sendPasswordResetOtpSchema = Joi.object({
  body: Joi.object({
    email: emailField.required(),
  }).required(),
});

const verifyPasswordResetOtpSchema = Joi.object({
  body: Joi.object({
    email: emailField.required(),
    otp: otpField.required(),
  }).required(),
});

const resetUserPasswordSchema = Joi.object({
  body: Joi.object({
    email: emailField.required(),
    newPassword: passwordField.required(),
  }).required(),
});

export {
  signupSchema,
  loginSchema,
  sendPasswordResetOtpSchema,
  verifyPasswordResetOtpSchema,
  resetUserPasswordSchema,
};
