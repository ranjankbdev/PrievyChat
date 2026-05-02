import Joi from 'joi';

// Reusable Joi fields

const nameField = Joi.string().min(4).max(25).trim().messages({
  'string.min': 'Name must be at least 4 characters long',
  'string.max': 'Name cannot exceed 25 characters',
  'string.base': 'Name must be a string',
});

const emailField = Joi.string().email().trim().messages({
  'string.email': 'Please provide a valid email address',
  'string.base': 'Email must be a string',
});

const passwordField = Joi.string().min(4).trim().messages({
  'string.min': 'Password must be at least 6 characters long',
  'string.base': 'Password must be a string',
});

const idField = Joi.string().length(24).hex().required().messages({
  'string.length': 'ID must be 24 characters long',
  'string.hex': 'ID must be a valid hexadecimal',
  'any.required': 'ID is required',
});

const chatIdField = idField.required().messages({
  'any.required': 'chatId is required',
});

const otpField = Joi.string()
  .trim()
  .pattern(/^[0-9]{6}$/)
  .required()
  .messages({
    'string.empty': 'Please enter you OTP',
    'string.pattern.base': 'OTP must be exactly 6 digits',
  });

export { nameField, emailField, passwordField, idField, chatIdField, otpField };
