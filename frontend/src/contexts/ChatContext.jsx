import { useContext, createContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext.jsx';
import { fetchNotifications } from '../services/notificationService.js';

export const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatStateProvider');
  }
  return context;
};

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
        } catch (error) {
          console.error('Error loading notifications:', error);
        }
      }
    };

    loadNotifications();
  }, [currentUser]);

  const groupedNotifications = useMemo(() => {
    const map = {};

    notification.forEach((n) => {
      const chatId = n.chat?._id;
      if (!chatId) return;

      if (!map[chatId]) {
        map[chatId] = {
          chat: n.chat,
          sender: n.sender,
          count: 1,
        };
      } else {
        map[chatId].count += 1;
      }
    });

    return map;
  }, [notification]);

  const value = {
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
    fetchAgain,
    setFetchAgain,
    groupedNotifications,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
