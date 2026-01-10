// returns display name and user info for a chat (1-on-1 or group)
const getSenderData = (
  currentUser,
  users = [],
  isGroupChat = false,
  chatName = 'Unnamed Group'
) => {
  if (!currentUser) return { name: 'Unknown', user: null };

  const otherUser = !isGroupChat ? users.find((u) => u._id !== currentUser._id) : null;

  return {
    name: isGroupChat ? chatName : otherUser?.name || 'Unknown',
    user: isGroupChat ? null : otherUser || null,
  };
};

export { getSenderData };
