// Export all API services from a single entry point
import { apiConfig, setEnvironment } from './config';
import apiClient from './client';
import authService from './services/authService';
import requirementService from './services/requirementService';

// Add more service exports as needed

export {
  apiConfig,
  setEnvironment,
  apiClient,
  authService,
  requirementService
};