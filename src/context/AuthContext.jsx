import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    // In a real app, you would verify credentials with your backend
    setUser(userData);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const register = (userData) => {
    // In a real app, you would send this data to your backend
    console.log('Registering user:', userData);
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);