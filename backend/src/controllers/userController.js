import { StatusCodes } from 'http-status-codes';
import { User } from '../models/userModel.js';
import { ExpressError } from '../utils/ExpressError.js';

const getUserById = async (req, res) => {
  // find the user by id of authentication
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    throw new ExpressError(StatusCodes.NOT_FOUND, 'User not found!');
  }

  res.status(StatusCodes.OK).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    picture: user.picture,
    message: 'User fetched successfully!',
  });
};

const getAllUsers = async (req, res) => {
  // if a search query exists, build a mongodb or filter for name/email (case-insensitive)
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};

  // fetch all users , excluding the logged-in user
  const users = await User.find({ ...keyword, _id: { $ne: req.user.id } }).select('-password');

  return res.status(StatusCodes.OK).json(users);
};

const updateUserProfile = async (req, res) => {
  const { name, picture } = req.body;

  // find the user
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    throw new ExpressError(StatusCodes.NOT_FOUND, 'User not found!');
  }

  let isUpdated = false;

  // update fields if provided
  if (name && name.trim() !== user.name) {
    user.name = name.trim();
    isUpdated = true;
  }

  if (picture && picture !== user.picture) {
    user.picture = picture;
    isUpdated = true;
  }

  if (!isUpdated) {
    return res.status(StatusCodes.OK).json({ message: 'No changes made!' });
  }
  // save updated user
  await user.save();

  res.status(StatusCodes.OK).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    picture: user.picture,
    message: 'Profile updated successfully!',
  });
};

export { getAllUsers, getUserById, updateUserProfile };
