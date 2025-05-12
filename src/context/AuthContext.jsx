import React, { createContext, useState, useContext, useEffect } from 'react';
const BYPASS_AUTH_FOR_TESTING = false;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (BYPASS_AUTH_FOR_TESTING) {
      return { name: "Test User" };
    }
    
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('authToken');
    
    if (storedUser && storedToken) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        return null;
      }
    }
    
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (userData, token) => {
    setUser(userData);
    if (token) {
      localStorage.setItem('authToken', token);
    }
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  const register = (userData) => {
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;