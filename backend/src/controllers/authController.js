import crypto from 'crypto';
import { StatusCodes } from 'http-status-codes';
import { User } from '../models/userModel.js';
import { ExpressError } from '../utils/ExpressError.js';
import { hashValue, genToken, compareHash } from '../utils/authHelper.js';
import { sendOtpEmail } from '../utils/emailService.js';

const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'strict',
  maxAge: 3 * 24 * 60 * 60 * 1000,
};

// signup
const signup = async (req, res) => {
  const { name, email, password, picture } = req.body;

  // check if email already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ExpressError(StatusCodes.CONFLICT, 'Email is already used, try different email!');
  }

  const hashedPassword = await hashValue(password);

  // create new user
  const newUser = new User({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    picture,
  });

  const savedUser = await newUser.save();
  const token = genToken(savedUser._id);

  res.cookie('token', token, cookieOptions);
  res.status(StatusCodes.CREATED).json();
};

// login
const login = async (req, res) => {
  const { email, password } = req.body;

  // check if user exists
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ExpressError(StatusCodes.UNAUTHORIZED, 'Invalid email or password!');
  }

  // match password
  const isMatched = await compareHash(password, user.password);
  if (!isMatched) {
    throw new ExpressError(StatusCodes.UNAUTHORIZED, 'Invalid email or password!');
  }

  const token = genToken(user._id);
  res.cookie('token', token, cookieOptions);

  res.status(StatusCodes.OK).json();
};

// logout
const logout = (req, res) => {
  res.clearCookie('token');
  res.status(StatusCodes.OK).json();
};

// otp for reset password
const sendPasswordResetOtp = async (req, res) => {
  const { email } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (!existingUser) {
    throw new ExpressError(StatusCodes.UNAUTHORIZED, 'Invalid email or password!');
  }

  const otp = crypto.randomInt(100000, 1000000).toString();

  existingUser.passwordResetOtp = await hashValue(otp);
  existingUser.isResetOtpVerified = false;
  existingUser.resetOtpExpires = new Date(Date.now() + 5 * 60 * 1000);
  await existingUser.save();

  await sendOtpEmail(
    email,
    'Reset Your Password',
    `<p>Your OTP for password reset is <b>${otp}</b>. It expires in 5 minutes.</p>`
  );

  return res.status(StatusCodes.OK).json();
};

// verify otp for reset password
const verifyPasswordResetOtp = async (req, res) => {
  const { email, otp } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (!existingUser) {
    throw new ExpressError(StatusCodes.UNAUTHORIZED, 'Invalid email or password!');
  }

  if (!existingUser.passwordResetOtp) {
    throw new ExpressError(StatusCodes.BAD_REQUEST, 'No OTP found. Please request a new OTP.');
  }

  if (!existingUser.resetOtpExpires || existingUser.resetOtpExpires < Date.now()) {
    throw new ExpressError(StatusCodes.BAD_REQUEST, 'OTP has expired');
  }

  const isMatchedOtp = await compareHash(otp, existingUser.passwordResetOtp);
  if (!isMatchedOtp) {
    throw new ExpressError(StatusCodes.BAD_REQUEST, 'Invalid OTP');
  }

  existingUser.isResetOtpVerified = true;
  existingUser.passwordResetOtp = undefined;
  existingUser.resetOtpExpires = undefined;
  await existingUser.save();

  return res.status(StatusCodes.OK).json();
};

// reset password
const resetUserPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (!existingUser) {
    throw new ExpressError(StatusCodes.UNAUTHORIZED, 'Invalid email or password!');
  }

  if (!existingUser.isResetOtpVerified) {
    throw new ExpressError(StatusCodes.UNAUTHORIZED, 'Please verify OTP first!');
  }

  const hashedPassword = await hashValue(newPassword);
  existingUser.password = hashedPassword;
  existingUser.isResetOtpVerified = false;
  existingUser.passwordResetOtp = undefined;
  existingUser.resetOtpExpires = undefined;
  await existingUser.save();

  return res.status(StatusCodes.OK).json();
};

export { signup, login, logout, sendPasswordResetOtp, verifyPasswordResetOtp, resetUserPassword };
