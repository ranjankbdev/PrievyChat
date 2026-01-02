import express from 'express';

import { wrapAsync } from '../utils/wrapAsync.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { getChatMessagesSchema, createMessageSchema } from '../schemas/messageSchema.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { getChatMessages, createMessage } from '../controllers/messageController.js';

const messageRouter = express.Router();

// get all messages of a specific chat
messageRouter.get(
  '/chat/:chatId',
  verifyToken,
  validateSchema(getChatMessagesSchema),
  wrapAsync(getChatMessages)
);

// create a message
messageRouter.post('/', verifyToken, validateSchema(createMessageSchema), wrapAsync(createMessage));

export { messageRouter };
