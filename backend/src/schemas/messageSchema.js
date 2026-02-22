import Joi from 'joi';
import { chatIdField, idField } from './baseSchema.js';

// get chat messages
const getChatMessagesSchema = Joi.object({
  params: Joi.object({
    chatId: chatIdField,
  }).required(),
});

// sendMessage schema (send a new message)
const createMessageSchema = Joi.object({
  body: Joi.object({
    content: Joi.string().trim().allow('', null).optional(),
    chatId: idField.messages({
      'any.required': 'chatId is required',
    }),
    messageType: Joi.string().valid('text', 'image', 'document').optional(),
    fileUrl: Joi.string().uri().allow('', null).optional(),
    fileName: Joi.string().allow('', null).optional(),
    fileSize: Joi.number()
      .integer()
      .positive()
      .max(1024 * 1024)
      .allow(null)
      .optional()
      .messages({
        'number.max': 'File size must not exceed 1Mb',
      }),
  })
    .required()
    .custom((value, helpers) => {
      const messageType = value.messageType || 'text';
      // Validate text messages
      if (messageType === 'text') {
        if (!value.content || !value.content.trim()) {
          return helpers.error('content.required');
        }
      }
      // Validate image/document messages
      if (messageType === 'image' || messageType === 'document') {
        if (!value.fileUrl || !value.fileUrl.trim()) {
          return helpers.error('fileUrl.required');
        }
      }
      return value;
    })
    .messages({
      'content.required': 'Text message content is required',
      'fileUrl.required': 'File URL is required for image/document messages',
    }),
});

export { getChatMessagesSchema, createMessageSchema };
