import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Config from '../config/index.js';

// hash the password using bcrypt with generated salt
const hashValue = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// generate JWT authentication token
const genToken = (id) => {
  return jwt.sign({ id }, Config.secretKey, {
    expiresIn: '3d',
  });
};

const compareHash = (enteredPassword, storedPassword) => {
  return bcrypt.compare(enteredPassword, storedPassword);
};

export { hashValue, genToken, compareHash };
