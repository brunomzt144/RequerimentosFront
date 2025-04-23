const API_URL = 'http://localhost:8080/';

/**
 * 
 * @returns {string|null} 
 */
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 *
 * @returns {Headers} 
 */
const getHeaders = () => {
  const token = getAuthToken();
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
      };
};

/**
 * Create requerimento
 * @returns {Promise<Object>} 
 */
export const fetchFinalidade = async () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Token inválido');
  }

  const requestOptions = {
    method: 'GET',
    headers: getHeaders()
  };

  try {
    const response = await fetch(`${API_URL}finalidade`, requestOptions);
    if (!response.ok) {
      const errorBody = await response.text(); 
      throw new Error(`Erro ao buscar finalidades: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }

}
/**
 * Pega requerimentos
 * @returns {Promise<Array>} 
 */
export const fetchRequirements = async () => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Token inválido');
    }
  
    const requestOptions = {
      method: 'GET',
      headers: getHeaders()
    };
    try {
      const response = await fetch(`${API_URL}requerimentos`, requestOptions);
      if (!response.ok) {
        const errorBody = await response.text(); 
        throw new Error(`Erro ao buscar requerimentos: ${response.status} ${response.statusText} - ${errorBody}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

/**
 * Get requiremento por ID
 * @param {number} id 
 * @returns {Promise<Object>} 
 */
export const getRequirementById = async (id) => {
  console.log(`Iniciando busca do requerimento ID: ${id}`);
  const token = getAuthToken();
  
  if (!token) {
    console.log(`Iniciando busca do requerimento ID: ${id}`);
    throw new Error('Token inválido');
  }
  
  const requestOptions = {
    method: 'GET',
    headers: getHeaders()
  };

  console.log(`Headers da requisição:`, requestOptions.headers);
  console.log(`URL da requisição: ${API_URL}/requerimentos/${id}`);
  
  const response = await fetch(`${API_URL}requerimentos/${id}`, requestOptions);

  console.log(`Status da resposta: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    console.error(`Erro na resposta: ${errorBody}`);
    throw new Error('Erro ao buscar requerimento');
  }
  
  return await response.json();
};

/**
 * Create requerimento
 * @param {Object} requirementData
 * @returns {Promise<Object>} 
 */
export const createRequirement = async (requirementData) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication token not found');
  }
  
  const requestOptions = {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(requirementData)
  };
  
  const response = await fetch(`${API_URL}/requirements`, requestOptions);
  
  if (!response.ok) {
    throw new Error('Failed to create requirement');
  }
  
  return await response.json();
};

/**
 * Update Requerimento
 * @param {number} id 
 * @param {Object} requirementData 
 * @returns {Promise<Object>} 
 */
export const updateRequirement = async (id, requirementData) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication token not found');
  }
  
  const requestOptions = {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(requirementData)
  };
  
  const response = await fetch(`${API_URL}/requirements/${id}`, requestOptions);
  
  if (!response.ok) {
    throw new Error('Failed to update requirement');
  }
  
  return await response.json();
};


export const getAnexosByRequerimentoId = async (requerimentoId) => {
  try {
    console.log(`Buscando anexos para o requerimento: ${requerimentoId}`);
    
    // Log the full URL
    const url = `${API_URL}anexos/requerimento/${requerimentoId}`;
    console.log(`URL completa: ${url}`);
    
    // Make the request
    const response = await fetch(url);
    console.log(`Resposta recebida: status ${response.status}`);
    
    // Check response type
    const contentType = response.headers.get('content-type');
    console.log(`Tipo de conteúdo: ${contentType}`);
    
    // If status is not ok, handle separately
    if (!response.ok) {
      console.error(`Status de erro: ${response.status} ${response.statusText}`);
      
      // Try to get error text instead of parsing as JSON
      const errorText = await response.text();
      console.error(`Corpo da resposta: ${errorText}`);
      
      throw new Error(`Erro ao buscar anexos: ${response.status} ${response.statusText}`);
    }
    
    // Check if response is empty
    const text = await response.text();
    console.log(`Resposta bruta: ${text}`);
    
    if (!text || text.trim() === '') {
      console.log('Resposta vazia recebida');
      return []; // Return empty array instead of trying to parse empty response
    }
    
    // Parse JSON only if we have text
    const data = JSON.parse(text);
    console.log(`Anexos recebidos: ${data.length || 0}`);
    return data;
  } catch (error) {
    console.error('Erro capturado:', error.message);
    console.error('Stack trace:', error.stack);
    throw new Error(`Falha na requisição: ${error.message}`);
  }
};


export const getAnexoDownloadUrl = (anexoId) => {
  return `${API_URL}anexos/${anexoId}/download`;
};