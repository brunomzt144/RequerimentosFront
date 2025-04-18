// Requirements service
import apiClient from '../client';

const requirementService = {
  /**
   * Get all requirements
   * @returns {Promise} Promise object with requirements data
   */
  getAll: async () => {
    try {
      const response = await apiClient.get('/requirements');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a requirement by ID
   * @param {string} id - Requirement ID
   * @returns {Promise} Promise object with requirement data
   */
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/requirements/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new requirement
   * @param {Object} requirementData - Requirement data
   * @returns {Promise} Promise object with created requirement
   */
  create: async (requirementData) => {
    try {
      const response = await apiClient.post('/requirements', requirementData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update an existing requirement
   * @param {string} id - Requirement ID
   * @param {Object} requirementData - Updated requirement data
   * @returns {Promise} Promise object with updated requirement
   */
  update: async (id, requirementData) => {
    try {
      const response = await apiClient.put(`/requirements/${id}`, requirementData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a requirement
   * @param {string} id - Requirement ID
   * @returns {Promise} Promise object with deletion response
   */
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/requirements/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default requirementService;