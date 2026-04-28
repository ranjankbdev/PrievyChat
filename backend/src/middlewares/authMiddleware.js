import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { ExpressError } from '../utils/ExpressError.js';
import Config from '../config/index.js';

const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return next(new ExpressError(StatusCodes.UNAUTHORIZED, 'No token provided'));
  }
  try {
    const decode = jwt.verify(token, Config.secretKey);
    req.user = decode;
    next();
  } catch {
    return next(new ExpressError(StatusCodes.UNAUTHORIZED, 'Invalid or expired token'));
  }
};

export { verifyToken };
