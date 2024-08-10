import React, { createContext, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const showNotification = (message, type) => {
    toast[type](message);
  };

  return (
    <NotificationContext.Provider value={showNotification}>
      {children}
      <ToastContainer />
    </NotificationContext.Provider>
  );
};
