// client/src/context/SocketContext.jsx
import React, { createContext, useEffect, useState, useContext } from 'react';
import io from 'socket.io-client';
import AuthContext from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');
      setSocket(newSocket);

      // Join user's personal room
      newSocket.emit('join', user._id);

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  // Join project room
  const joinProject = (projectId) => {
    if (socket) {
      socket.emit('joinProject', projectId);
    }
  };

  // Leave project room
  const leaveProject = (projectId) => {
    if (socket) {
      socket.emit('leaveProject', projectId);
    }
  };

  // Emit task update
  const emitTaskUpdate = (data) => {
    if (socket) {
      socket.emit('taskUpdated', data);
    }
  };

  // Emit new comment
  const emitNewComment = (data) => {
    if (socket) {
      socket.emit('newComment', data);
    }
  };

  const value = {
    socket,
    joinProject,
    leaveProject,
    emitTaskUpdate,
    emitNewComment,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export default SocketContext;