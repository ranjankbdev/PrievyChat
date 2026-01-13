import axiosInstance from '../config/axiosInstance.js';

const fetchChatsService = async () => {
  const { data } = await axiosInstance.get('/chats');
  return data;
};

const createGroupChat = async (payload) => {
  const { data } = await axiosInstance.post('/chats/group', payload);
  return data;
};

const renameGroup = async (chatId, chatName) => {
  const { data } = await axiosInstance.put('/chats/group/rename', {
    chatId,
    chatName,
  });
  return data;
};

const removeUserFromGroup = async (chatId, userId) => {
  const { data } = await axiosInstance.put('/chats/group/remove-user', {
    chatId,
    userId,
  });
  return data;
};

const addUserToGroup = async (chatId, userId) => {
  const { data } = await axiosInstance.put('/chats/group/add-user', {
    chatId,
    userId,
  });
  return data;
};

const updateGroupPicture = async (chatId, picture) => {
  const { data } = await axiosInstance.put('/chats/group/update-picture', {
    chatId,
    picture,
  });
  return data;
};

export {
  fetchChatsService,
  createGroupChat,
  removeUserFromGroup,
  renameGroup,
  addUserToGroup,
  updateGroupPicture,
};
