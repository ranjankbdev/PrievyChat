import axiosInstance from '../config/axiosInstance.js';

const fetchChatsService = async () => {
  const { data } = await axiosInstance.get('/chats');
  return data;
};

const createGroupChat = async (payload) => {
  const { data } = await axiosInstance.post('/chats/group', payload);
  return data;
};

export { fetchChatsService, createGroupChat };
