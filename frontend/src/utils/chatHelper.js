// returns display name and user info for a chat (1-on-1 or group)
const getSenderData = (currentUser, chat) => {
  if (!currentUser || !chat) {
    return { name: 'Unknown', user: null, picture: null };
  }

  if (chat.isGroupChat) {
    return {
      name: chat.chatName || 'Unnamed Group',
      user: null,
      picture: chat.picture || '/avatar.jpg',
    };
  }

  const otherUser = chat.users?.find((u) => u._id !== currentUser._id);
  return {
    name: otherUser?.name || 'Unknown',
    user: otherUser || null,
    picture: otherUser?.picture || '/avatar.jpg',
  };
};

// whether to show avatar beside a message
const isMessageFromDifferentSender = (messages, m, i, userId) => {
  return m.sender._id !== userId && (i === 0 || messages[i - 1].sender._id !== m.sender._id);
};

// checks if the CURRENT message is the FINAL message
const isFirstMessage = (messages, i) => {
  return i === 0 || messages[i - 1].sender._id !== messages[i].sender._id;
};

// returns TRUE if previous message is from same sender
const isPreviousMessageSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

// check if a specific user is online
const isUserOnline = (userId, onlineUsers) => {
  return onlineUsers.has(userId);
};

// check if any user in group is online (excluding current user)
const isAnyGroupUserOnline = (chatUsers, currentUserId, onlineUsers) => {
  return chatUsers.some((user) => user._id !== currentUserId && onlineUsers.has(user._id));
};

// get online status for chat
const getChatOnlineStatus = (chat, currentUserId, onlineUsers) => {
  if (!chat || !chat.users) return false;

  if (chat.isGroupChat) {
    // for group: check if any user (except current) is online
    return isAnyGroupUserOnline(chat.users, currentUserId, onlineUsers);
  } else {
    // for 1-to-1: check if the other user is online
    const otherUser = chat.users.find((user) => user._id !== currentUserId);
    return otherUser ? isUserOnline(otherUser._id, onlineUsers) : false;
  }
};

export {
  getSenderData,
  isMessageFromDifferentSender,
  isFirstMessage,
  isPreviousMessageSameUser,
  isUserOnline,
  isAnyGroupUserOnline,
  getChatOnlineStatus,
};
