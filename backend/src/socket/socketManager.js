import jwt from 'jsonwebtoken';
import Config from '../config/index.js';

const onlineUsers = new Map(); // userId -> socketId

const connectToSocket = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('No token'));

    try {
      const decoded = jwt.verify(token, Config.secretKey);
      socket.user = decoded;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log('Connected to socket.io', socket.id);

    // setup user room
    socket.on('setup', (userData) => {
      socket.join(userData._id);

      // mark user as online FIRST
      onlineUsers.set(userData._id, socket.id);

      // send list of currently online users to this new user
      const currentlyOnlineUsers = Array.from(onlineUsers.keys());
      socket.emit('online users', currentlyOnlineUsers);

      // broadcast to all OTHER users that this user is online
      socket.broadcast.emit('user online', userData._id);
    });

    // join a chat room
    socket.on('join chat', (room) => {
      socket.join(room);
      console.log('User joined room:', room);
    });

    // handle new message
    socket.on('new message', (newMessage) => {
      const chat = newMessage?.chat;
      const senderId = newMessage?.sender?._id?.toString();
      if (!chat?.users || !senderId) return;

      // get all users except the sender
      const recipients = chat.users.filter((user) => user?._id?.toString() !== senderId);

      // emit message to each recipient's personal room
      recipients.forEach((user) => {
        socket.to(user._id.toString()).emit('message received', newMessage);
        console.log(`Sent message from ${senderId} to ${user._id.toString()} in personal room`);
      });
    });

    // typing indicator - user started typing
    socket.on('typing', (chatId) => {
      socket.to(chatId).emit('typing', chatId);
    });

    // typing indicator - user stopped typing
    socket.on('stop typing', (chatId) => {
      socket.to(chatId).emit('stop typing', chatId);
    });

    // handle disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected', socket.id);

      // find and remove user from onlineUsers
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);

          // broadcast to all users that this user is offline
          socket.broadcast.emit('user offline', userId);
          console.log(`User ${userId} is offline`);
          break;
        }
      }
    });
  });
};

export { connectToSocket };
