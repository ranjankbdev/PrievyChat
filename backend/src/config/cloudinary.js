import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const CloudinaryConfig = {
  cloudName: process.env.CLOUD_NAME,
  apiKey: process.env.CLOUD_API_KEY,
  apiSecret: process.env.CLOUD_API_SECRET,
  uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
};

export default CloudinaryConfig;
