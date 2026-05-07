import axios from 'axios';
import axiosInstance from '../config/axiosInstance.js';
import { getCloudinarySignature } from '../config/config.js';

// upload profile picture to Cloudinary
const uploadProfileImage = async (file) => {
  // Fetch config from backend
  const { cloudName, cloudApiKey, timestamp, signature } = await getCloudinarySignature();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', cloudApiKey);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);

  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    formData
  );
  return res.data.secure_url;
};

// update user profile
const updateUserProfileAPI = async (payload) => {
  const { data } = await axiosInstance.put('/users/me', payload);
  return data;
};

// search user
const searchUsers = async (query) => {
  if (!query.trim()) return [];
  const { data } = await axiosInstance.get(`/users?search=${query}`);
  return data;
};

// select/Access chat
const accessChatWithUser = async (userId) => {
  const { data } = await axiosInstance.post('/chats/one-to-one', { userId });
  return data;
};

export { uploadProfileImage, updateUserProfileAPI, searchUsers, accessChatWithUser };
