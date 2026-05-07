import app from './app.js';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import Config from './config/index.js';
import { Server } from 'socket.io';
import { connectToSocket } from './socket/socketManager.js';

// HTTP + Socket.IO Server
const server = http.createServer(app);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: Config.frontendUrl,
    credentials: true,
  },
});

// Connect socket logic
connectToSocket(io);

// connect to MongoDB and start the server
const start = async () => {
  try {
    await mongoose.connect(Config.mongoUri);
    console.log(`Connected to Database...`);

    server.listen(Config.port, () => {
      console.log(`Server listening on port ${Config.port}...`);
    });
  } catch (error) {
    console.log(`Could not connect to database... ${error.message}`);
    process.exit(1);
  }
};

start();
