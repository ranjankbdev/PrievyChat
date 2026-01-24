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

// whether to show avatar beside a message
const isMessageFromDifferentSender = (messages, m, i, userId) => {
  return (
    m.sender._id !== userId &&
    (i === messages.length - 1 || messages[i + 1].sender._id !== m.sender._id)
  );
};

// checks if the CURRENT message is the FINAL message
const isFinalMessage = (messages, i) => {
  return i === messages.length - 1 || messages[i + 1].sender._id !== messages[i].sender._id;
};

// returns TRUE if previous message is from same sender
const isPreviousMessageSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export { getSenderData, isMessageFromDifferentSender, isFinalMessage, isPreviousMessageSameUser };
