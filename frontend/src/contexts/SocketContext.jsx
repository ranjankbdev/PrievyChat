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

  useEffect(() => {
    if (!currentUser) return;

    const newSocket = io(ENDPOINT);
    setSocket(newSocket);

    // built-in connection
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setIsConnected(true); // user is connected
      newSocket.emit('setup', currentUser);
    });

    // custom confirmation from server
    newSocket.on('connected', () => {
      console.log('Socket setup completed');
    });

    // receive list of currently online users when connecting
    newSocket.on('online users', (userIds) => {
      setOnlineUsers(new Set(userIds));
      console.log('Currently online users:', userIds);
    });

    // listen for user coming online
    newSocket.on('user online', (userId) => {
      setOnlineUsers((prev) => new Set([...prev, userId]));
      console.log(`User ${userId} is now online`);
    });

    // listen for user going offline
    newSocket.on('user offline', (userId) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
      console.log(`User ${userId} is now offline`);
    });

    // handle disconnection
    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false); // user is disconnected
    });

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser]);

  const value = { socket, onlineUsers, isConnected };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
