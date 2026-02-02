import { useContext, createContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import { fetchNotifications } from '../services/notificationService.js';

export const ChatContext = createContext();
export const useChat = () => useContext(ChatContext);

export const ChatStateProvider = ({ children }) => {
  const { currentUser } = useAuth();

  // holds the currently opened chat window
  const [selectedChat, setSelectedChat] = useState(null);

  // stores all chats belonging to the user
  const [chats, setChats] = useState([]);

  // stores unread notifications from backend
  const [notification, setNotification] = useState([]);

  // force refresh of chats across components
  const [fetchAgain, setFetchAgain] = useState(false);

  // fetch notifications from backend when user logs in
  useEffect(() => {
    const loadNotifications = async () => {
      if (currentUser?.token) {
        try {
          const notifications = await fetchNotifications();
          setNotification(notifications);
          console.log(notifications);
        } catch (error) {
          console.error('Error loading notifications:', error);
        }
      }
    };

    loadNotifications();
  }, [currentUser]);

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
