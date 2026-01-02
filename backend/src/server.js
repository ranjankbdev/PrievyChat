import app from './app.js';
import mongoose from 'mongoose';
import Config from './config/index.js';

// connect to MongoDB and start the server
const start = async () => {
  try {
    await mongoose.connect(Config.mongoUri);
    console.log(`Connected to Database...`);

    app.listen(Config.port, () => {
      console.log(`Server running on port ${Config.port}...`);
    });
  } catch (error) {
    console.log(`Could not connect to database... ${error.message}`);
    process.exit(1);
  }
};

start();
