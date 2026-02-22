import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { wrapAsync } from '../utils/wrapAsync.js';
import { createUploadSignature } from '../controllers/cloudinaryController.js';

const cloudinaryRouter = express.Router();

cloudinaryRouter.post('/signature', verifyToken, wrapAsync(createUploadSignature));

export { cloudinaryRouter };
