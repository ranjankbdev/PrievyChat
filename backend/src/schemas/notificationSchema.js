import Joi from 'joi';
import { chatIdField } from './baseSchema.js';

// mark notifications as read
const markNotificationsAsReadSchema = Joi.object({
  params: Joi.object({
    chatId: chatIdField,
  }).required(),
});

export { markNotificationsAsReadSchema };
