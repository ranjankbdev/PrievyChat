import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import CloudinaryConfig from '../config/cloudinary.js';

const cloudinaryRouter = express.Router();

cloudinaryRouter.get('/config', verifyToken, (req, res) => {
  if (!CloudinaryConfig.cloudName || !CloudinaryConfig.uploadPreset) {
    return res.status(500).json({
      success: false,
      message: 'Cloudinary configuration is not properly set up',
    });
  }

  res.json({
    cloudName: CloudinaryConfig.cloudName,
    uploadPreset: CloudinaryConfig.uploadPreset,
  });
});

export { cloudinaryRouter };
