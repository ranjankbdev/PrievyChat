import express from 'express';
import { wrapAsync } from '../utils/wrapAsync.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import {
  getUserNotifications,
  markChatNotificationsAsRead,
} from '../controllers/notificationController.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { markNotificationsAsReadSchema } from '../schemas/notificationSchema.js';

const notificationRouter = express.Router();

// get all unread notifications
notificationRouter.get('/', verifyToken, wrapAsync(getUserNotifications));

// mark all notifications for a specific chat as read
notificationRouter.put(
  '/chat/:chatId/read',
  verifyToken,
  validateSchema(markNotificationsAsReadSchema),
  wrapAsync(markChatNotificationsAsRead)
);

export { notificationRouter };
