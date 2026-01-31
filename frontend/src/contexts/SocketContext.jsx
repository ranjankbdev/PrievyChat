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

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    const newSocket = io(ENDPOINT);
    setSocket(newSocket);

    // built-in connection
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      newSocket.emit('setup', currentUser);
    });
    // custom confirmation from server
    newSocket.on('connected', () => {
      console.log('Socket setup completed');
    });

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser]);

  const value = { socket };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
