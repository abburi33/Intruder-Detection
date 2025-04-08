import React, { createContext, useState, useContext } from "react";

// Create Context
const AlertContext = createContext();

// Create a Provider component
export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const addAlert = (alert) => {
    setAlerts((prevAlerts) => [alert, ...prevAlerts]);
  };

  return (
    <AlertContext.Provider value={{ alerts, addAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

// Create a custom hook to use the AlertContext
export const useAlerts = () => useContext(AlertContext);
