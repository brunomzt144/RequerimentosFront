const environments = {
    development: {
      baseURL: 'http://localhost:8080/',
    },
    production: {
      baseURL: 'https://your-production-domain.com/api',
    }
  };
  
  const currentEnv = import.meta.env.MODE || 'development';
  
  
  export const apiConfig = environments[currentEnv];
  
  export const setEnvironment = (env) => {
    if (environments[env]) {
      return environments[env];
    }
    console.warn(`Environment "${env}" not found, using default`);
    return environments.development;
  };