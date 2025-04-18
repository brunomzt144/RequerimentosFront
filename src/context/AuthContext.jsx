import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../api';

// Set this to true to bypass authentication checks for testing
const BYPASS_AUTH_FOR_TESTING = false; // Switch to false when ready for production

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state based on localStorage or testing mode
  const [user, setUser] = useState(() => {
    if (BYPASS_AUTH_FOR_TESTING) {
      return { name: "Test User" };
    }
    
    // Check if we have a token and user data in localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        return JSON.parse(userData);
      } catch (e) {
        // If parsing fails, clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    return null;
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Login function that uses authService
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the API login endpoint via authService
      const response = await authService.login(username, password);
      
      // Store user data in localStorage for persistence
      if (response && response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
      }
      
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function that uses authService
  const logout = () => {
    authService.logout(); // This will clear the token in localStorage
    localStorage.removeItem('user');
    setUser(null);
  };

  // Register function that uses authService
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the API register endpoint via authService
      const response = await authService.register(userData);
      
      return true;
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check if token is valid on initial load
  useEffect(() => {
    // Skip if in testing mode or no token exists
    if (BYPASS_AUTH_FOR_TESTING || !authService.getToken()) {
      return;
    }
    
    // You could add an API endpoint to validate the token
    // This would be a good place to refresh the token if needed
    const validateToken = async () => {
      try {
        // Example: const response = await authService.validateToken();
        // If invalid, logout: if (!response.valid) logout();
      } catch (err) {
        // If there's an error, assume token is invalid
        logout();
      }
    };
    
    validateToken();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register, 
      loading, 
      error, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;