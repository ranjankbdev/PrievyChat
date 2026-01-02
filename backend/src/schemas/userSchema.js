import Joi from 'joi';
import { nameField } from './baseSchema.js';

const updateUserProfileSchema = Joi.object({
  body: Joi.object({
    name: nameField.optional(),
    picture: Joi.string().uri().optional(),
  })
    .min(1)
    .required()
    .messages({
      'object.min': 'At least one field (name or picture) is required',
    }),
});

export { updateUserProfileSchema };
