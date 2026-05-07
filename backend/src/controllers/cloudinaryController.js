import crypto from 'crypto';
import { StatusCodes } from 'http-status-codes';
import { ExpressError } from '../utils/ExpressError.js';
import Config from '../config/index.js';

const { cloudName, cloudApiKey, cloudApiSecret } = Config;

const createUploadSignature = async (req, res) => {
  if (!cloudName || !cloudApiKey || !cloudApiSecret) {
    throw new ExpressError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Cloudinary configuration is not properly set up'
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  const signature = crypto
    .createHash('sha1')
    .update(`timestamp=${timestamp}${cloudApiSecret}`)
    .digest('hex');

  res.status(StatusCodes.OK).json({
    cloudName,
    cloudApiKey,
    timestamp,
    signature,
  });
};

export { createUploadSignature };
