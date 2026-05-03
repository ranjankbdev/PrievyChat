import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      default: 'https://res.cloudinary.com/dwv10qvzj/image/upload/v1777778232/avatar_wm3pfk.jpg',
    },
    passwordResetOtp: {
      type: String,
    },
    isResetOtpVerified: {
      type: Boolean,
      default: false,
    },
    resetOtpExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

// prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model('User', userSchema);
export { User };
