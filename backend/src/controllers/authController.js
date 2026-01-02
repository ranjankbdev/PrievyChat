import { StatusCodes } from 'http-status-codes';
import { User } from '../models/userModel.js';
import { ExpressError } from '../utils/ExpressError.js';
import { hashPassword, genToken, comparePassword } from '../utils/authHelper.js';

const signup = async (req, res) => {
  const { name, email, password, picture } = req.body;

  // check if email already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ExpressError(StatusCodes.CONFLICT, 'Email is already used, try different email!');
  }

  const hashedPassword = await hashPassword(password);

  // create new user
  const newUser = new User({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    picture,
  });

  const savedUser = await newUser.save();
  const token = genToken(savedUser._id);

  res.status(StatusCodes.CREATED).json({ message: 'User created successfully!', token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // check if user exists
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ExpressError(StatusCodes.UNAUTHORIZED, 'Invalid email or password!');
  }

  // match password
  const isMatched = await comparePassword(password, user.password);
  if (!isMatched) {
    throw new ExpressError(StatusCodes.UNAUTHORIZED, 'Invalid email or password!');
  }

  const token = genToken(user._id);

  res.status(StatusCodes.OK).json({ message: 'Login successfull!', token });
};

export { signup, login };
