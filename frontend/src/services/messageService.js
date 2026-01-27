import axiosInstance from '../config/axiosInstance.js';
import axios from 'axios';

export const fetchChatMessages = async (chatId) => {
  const { data } = await axiosInstance.get(`/messages/chat/${chatId}`);
  return data;
};

export const sendMessage = async (
  content,
  chatId,
  messageType = 'text',
  fileUrl = null,
  fileName = null,
  fileSize = null
) => {
  // Build request body conditionally
  const requestBody = { chatId, messageType };

  // For text messages
  if (messageType === 'text') {
    requestBody.content = content;
  }

  // For image/document messages
  if (messageType === 'image' || messageType === 'document') {
    requestBody.fileUrl = fileUrl;
    requestBody.fileName = fileName;
    requestBody.fileSize = fileSize;
    if (content && content.trim()) {
      requestBody.content = content;
    }
  }

  const { data } = await axiosInstance.post('/messages', requestBody);
  return data;
};

// Upload file (image or document) to Cloudinary
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ChatApk');
  formData.append('cloud_name', 'dwv10qvzj');

  // Determine if it's an image or other file type
  const isImage = file.type.startsWith('image/');

  // Use different upload endpoints based on file type
  const uploadUrl = isImage
    ? 'https://api.cloudinary.com/v1_1/dwv10qvzj/image/upload'
    : 'https://api.cloudinary.com/v1_1/dwv10qvzj/raw/upload';

  const res = await axios.post(uploadUrl, formData);
  return res.data.secure_url;
};
