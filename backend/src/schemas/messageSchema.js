import Joi from 'joi';
import { chatIdField } from './baseSchema.js';

// get chat messages
const getChatMessagesSchema = Joi.object({
  params: Joi.object({
    chatId: chatIdField,
  }).required(),
});

// sendMessage schema (send a new message)
const createMessageSchema = Joi.object({
  body: Joi.object({
    content: Joi.string().trim().required().messages({
      'string.empty': 'Message content cannot be empty',
      'any.required': 'Message content is required',
    }),
    chatId: chatIdField,
  }).required(),
});

export { getChatMessagesSchema, createMessageSchema };
