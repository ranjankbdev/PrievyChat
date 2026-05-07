import { createContext, useContext, useEffect, useState } from 'react';
import { SOCKET_URL } from '../config/config.js';
import { useAuth } from './AuthContext.jsx';
import io from 'socket.io-client';

const ENDPOINT = SOCKET_URL;

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { currentUser } = useAuth();

  // Socket.IO client instance
  const [socket, setSocket] = useState(null);

  // set of userIds currently online (real-time presence)
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  // track user's own connection status
  const [isConnected, setIsConnected] = useState(false);

  // typing state
  const [typingUsers, setTypingUsers] = useState({});

  useEffect(() => {
    if (!currentUser) return;

    const newSocket = io(ENDPOINT, {
      auth: { token: localStorage.getItem('token') },
    });
    setSocket(newSocket);

    // built-in connection
    newSocket.on('connect', () => {
      setIsConnected(true); // user is connected
      newSocket.emit('setup', currentUser);
    });

    // receive list of currently online users when connecting
    newSocket.on('online users', (userIds) => {
      setOnlineUsers(new Set(userIds));
    });

    // listen for user coming online
    newSocket.on('user online', (userId) => {
      setOnlineUsers((prev) => new Set([...prev, userId]));
    });

    // listen for user going offline
    newSocket.on('user offline', (userId) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
    });

    // listen for typing events
    newSocket.on('typing', (chatId) => {
      setTypingUsers((prev) => ({ ...prev, [chatId]: true }));
    });

    newSocket.on('stop typing', (chatId) => {
      setTypingUsers((prev) => {
        const updated = { ...prev };
        delete updated[chatId];
        return updated;
      });
    });

    // handle disconnection
    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      newSocket.off('connect');
      newSocket.off('online users');
      newSocket.off('user online');
      newSocket.off('user offline');
      newSocket.off('typing');
      newSocket.off('stop typing');
      newSocket.off('disconnect');
      newSocket.disconnect();
    };
  }, [currentUser]);

  const value = { socket, onlineUsers, isConnected, typingUsers };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
