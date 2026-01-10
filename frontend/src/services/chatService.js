import axiosInstance from '../config/axiosInstance.js';

const fetchChatsService = async () => {
  const { data } = await axiosInstance.get('/chats');
  return data;
};

export { fetchChatsService };
