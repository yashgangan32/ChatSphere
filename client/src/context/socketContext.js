// SocketContext.js
import React, { createContext, useContext, useState } from 'react';
import io from 'socket.io-client';

// Create a context with default value of null
const SocketContext = createContext(null);

// Custom hook to use the SocketContext
export const useSocket = () => {
  return useContext(SocketContext);
};

// SocketProvider component
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  // Function to initialize the socket connection
  const initializeSocket = () => {
    const socketConnection = io(process.env.REACT_APP_BACKEND_URL, {
      transports: ['websocket', 'polling'],
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    setSocket(socketConnection);

    return socketConnection; // Return the socket instance
  };

  return (
    <SocketContext.Provider value={{ socket, initializeSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
