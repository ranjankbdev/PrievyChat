import { StatusCodes } from 'http-status-codes';
import { Chat } from '../models/chatModel.js';
import { Message } from '../models/messageModel.js';
import { Notification } from '../models/notificationModel.js';
import { ExpressError } from '../utils/ExpressError.js';

const getChatMessages = async (req, res) => {
  const { chatId } = req.params;

  // check chat is exist or not
  const chat = await Chat.findById(chatId).populate('users', '-password');
  if (!chat) {
    throw new ExpressError(StatusCodes.NOT_FOUND, 'Chat not found');
  }

  // Check if requesting user is part of the chat
  if (!chat.users.map((u) => u._id.toString()).includes(req.user.id)) {
    throw new ExpressError(StatusCodes.FORBIDDEN, 'You are not a member of this chat');
  }

  // Fetch messages for the chat
  const messages = await Message.find({ chat: chatId })
    .populate('sender', 'name email picture')
    .populate({
      path: 'chat',
      populate: {
        path: 'users groupAdmin',
        select: 'name email picture',
      },
    })
    .sort({ createdAt: 1 })
    .lean();
  res.status(StatusCodes.OK).json(messages);
};

const createMessage = async (req, res) => {
  const { content, chatId, messageType, fileUrl, fileName, fileSize } = req.body;

  // check chat exists (no unnecessary populate)
  const chat = await Chat.findById(chatId).select('users');
  if (!chat) {
    throw new ExpressError(StatusCodes.NOT_FOUND, 'Chat not found');
  }

  // check if requesting user is part of the chat
  const isMember = chat.users.some((userId) => userId.toString() === req.user.id);
  if (!isMember) {
    throw new ExpressError(StatusCodes.FORBIDDEN, 'You are not a member of this chat');
  }

  // determine message type
  const type = messageType || 'text';

  // validate based on message type
  if (type === 'text') {
    const trimmedContent = content?.trim() || '';
    if (!trimmedContent) {
      throw new ExpressError(StatusCodes.BAD_REQUEST, 'Text message content is required');
    }
  }

  if (type === 'image' || type === 'document') {
    if (!fileUrl) {
      throw new ExpressError(StatusCodes.BAD_REQUEST, `File URL is required for ${type} messages`);
    }
  }

  // create message payload
  const messageData = {
    sender: req.user.id,
    chat: chatId,
    messageType: type,
  };

  if (type === 'text') {
    messageData.content = content?.trim() || '';
  } else if (type === 'image' || type === 'document') {
    messageData.fileUrl = fileUrl;
    messageData.fileName = fileName || 'Unknown';
    messageData.fileSize = fileSize || 0;
    messageData.content = content?.trim() || '';
  }

  // save message
  let newMessage = await Message.create(messageData);

  // populate sender
  newMessage = await newMessage.populate('sender', 'name email picture');

  // populate chat → users & groupAdmin
  newMessage = await newMessage.populate({
    path: 'chat',
    populate: {
      path: 'users groupAdmin',
      select: 'name email picture',
    },
  });

  // update chat latestMessage
  await Chat.findByIdAndUpdate(chatId, {
    latestMessage: newMessage._id,
  });

  // create notifications for all users except sender
  const notifications = chat.users
    .filter((userId) => userId.toString() !== req.user.id)
    .map((userId) =>
      Notification.create({
        recipient: userId,
        message: newMessage._id,
        chat: chatId,
      })
    );

  await Promise.all(notifications);

  // send response
  res.status(StatusCodes.CREATED).json(newMessage);
};

export { getChatMessages, createMessage };
