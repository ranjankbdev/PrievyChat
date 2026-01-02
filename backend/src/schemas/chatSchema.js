import Joi from 'joi';
import { nameField, idField, chatIdField } from './baseSchema.js';

// create/access chat schema
const oneToOneChatSchema = Joi.object({
  body: Joi.object({
    userId: idField.required(),
  }).required(),
});

//  create group chat schema
const createGroupChatSchema = Joi.object({
  body: Joi.object({
    name: nameField.required().messages({
      'string.empty': 'Group name is required',
    }),
    users: Joi.array()
      .items(idField)
      .min(2) // minimum 2 users from frontend
      .unique()
      .required()
      .messages({
        'array.min': 'At least 2 users are required to create a group chat',
        'array.base': 'Users must be an array of user IDs',
      }),
    picture: Joi.string().uri().allow('', null).optional(),
  }).required(),
});

// rename group chat schema
const updateGroupChatSchema = Joi.object({
  body: Joi.object({
    chatId: chatIdField,
    chatName: nameField.required().messages({
      'string.empty': 'chatName cannot be empty',
      'any.required': 'chatName is required',
    }),
  }).required(),
});

// add/remove user from a group
const groupUserActionSchema = Joi.object({
  body: Joi.object({
    chatId: chatIdField,
    userId: idField.required(),
  }).required(),
});

export { oneToOneChatSchema, createGroupChatSchema, updateGroupChatSchema, groupUserActionSchema };
