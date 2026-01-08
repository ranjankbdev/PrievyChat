import { useContext, createContext, useState } from 'react';

export const ChatContext = createContext();
export const useChat = () => useContext(ChatContext);

export const ChatStateProvider = ({ children }) => {
  // holds the currently opened chat window
  const [selectedChat, setSelectedChat] = useState(null);

  // stores all chats belonging to the user
  const [chats, setChats] = useState([]);

  // stores unread notifications from backend
  const [notification, setNotification] = useState([]);

  // force refresh of chats across components
  const [fetchAgain, setFetchAgain] = useState(false);

  const value = {
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
    fetchAgain,
    setFetchAgain,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
