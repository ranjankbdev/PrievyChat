import express from 'express';
import { wrapAsync } from '../utils/wrapAsync.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import {
  oneToOneChatSchema,
  createGroupChatSchema,
  updateGroupChatSchema,
  groupUserActionSchema,
} from '../schemas/chatSchema.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import {
  getOrCreateOneToOneChat,
  getUserChats,
  createNewGroupChat,
  updateGroupChatName,
  addUserToGroupChat,
  removeUserFromGroupChat,
  updateGroupChatPicture,
} from '../controllers/chatController.js';

const chatRouter = express.Router();

// create/get one-to-one chat
chatRouter.post(
  '/one-to-one',
  verifyToken,
  validateSchema(oneToOneChatSchema),
  wrapAsync(getOrCreateOneToOneChat)
);

// get all user chats
chatRouter.get('/', verifyToken, wrapAsync(getUserChats));

// create a new group chat
chatRouter.post(
  '/group',
  verifyToken,
  validateSchema(createGroupChatSchema),
  wrapAsync(createNewGroupChat)
);

// rename a group chat
chatRouter.put(
  '/group/rename',
  verifyToken,
  validateSchema(updateGroupChatSchema),
  wrapAsync(updateGroupChatName)
);

// add a user to the group
chatRouter.put(
  '/group/add-user',
  verifyToken,
  validateSchema(groupUserActionSchema),
  wrapAsync(addUserToGroupChat)
);

// remove a user from the group
chatRouter.put(
  '/group/remove-user',
  verifyToken,
  validateSchema(groupUserActionSchema),
  wrapAsync(removeUserFromGroupChat)
);

// update group chat picture
chatRouter.put('/group/update-picture', verifyToken, wrapAsync(updateGroupChatPicture));

export { chatRouter };
