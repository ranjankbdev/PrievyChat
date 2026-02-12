import axios from 'axios';
import axiosInstance from '../config/axiosInstance.js';
import { getCloudinaryConfig } from '../config/config.js';

// upload profile picture to Cloudinary
const uploadProfileImage = async (file) => {
  // Fetch config from backend
  const config = await getCloudinaryConfig();

  if (!config || !config.cloudName || !config.uploadPreset) {
    throw new Error('Cloudinary configuration is missing');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', config.uploadPreset);
  formData.append('cloud_name', config.cloudName);

  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
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
