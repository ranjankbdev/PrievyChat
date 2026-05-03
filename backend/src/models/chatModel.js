import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    picture: {
      type: String,
      default: 'https://res.cloudinary.com/dwv10qvzj/image/upload/v1777778232/avatar_wm3pfk.jpg',
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model('Chat', chatSchema);
export { Chat };
