// Authentication service
import apiClient from '../client';

const authService = {
  /**
   * Login user
   * @param {string} username - User's username or email
   * @param {string} password - User's password
   * @returns {Promise} Promise object with login response
   */
  login: async (username, password) => {
    try {
      const response = await apiClient.post('/login', { username, password });
      
      // Store the JWT token in localStorage
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Promise object with registration response
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post('/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout user - clear token
   */
  logout: () => {
    localStorage.removeItem('token');
    // Any additional cleanup can be done here
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user has a token
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Get the current user's JWT token
   * @returns {string|null} The JWT token or null
   */
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default authService;