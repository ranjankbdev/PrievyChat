const connectToSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('Connected to socket.io', socket.id);

    // setup user room
    socket.on('setup', (userData) => {
      socket.join(userData._id);
      socket.emit('connected');
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
  });
};

export { connectToSocket };
