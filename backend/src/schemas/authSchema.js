import Joi from 'joi';
import { nameField, emailField, passwordField } from './baseSchema.js';

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

export { signupSchema, loginSchema };
