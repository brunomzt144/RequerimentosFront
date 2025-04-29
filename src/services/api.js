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

  const requestOptions = {
    method: 'GET',
    headers: getHeaders()
  };
  
  const response = await fetch(`${API_URL}requerimentos/${id}`, requestOptions);


  if (!response.ok) {
    throw new Error('Erro ao buscar requerimento');
  }
  
  return await response.json();
};

/**
 * Create requerimento with files
 * @param {string} finalidade - ID of the finalidade
 * @param {string} justificativa - Description of the request
 * @param {File[]} files - Array of files to upload
 * @returns {Promise<Object>} - Created requerimento
 */
export const createRequerimento = async (finalidade, justificativa, files) => {
  
  const token = getAuthToken();

  const formData = new FormData();
  formData.append('finalidade', finalidade);
  formData.append('justificativa', justificativa);
  
  if (files && files.length > 0) {
    files.forEach((file, index) => {
      formData.append('files', file);
    });
  } 
  const headers = {
    'Authorization': `Bearer ${token}`
  };
  
  try {
    const response = await fetch(`${API_URL}requerimentos`, {
      method: 'POST',
      headers: headers,
      body: formData
    });
    
    
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Erro ao criar requerimento: ${response.status} ${response.statusText} - ${errorBody}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};


export const getAnexosByRequerimentoId = async (requerimentoId) => {
  try {
    const url = `${API_URL}anexos/requerimento/${requerimentoId}`;
    
    const response = await fetch(url);

    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar anexos: ${response.status} ${response.statusText}`);
    }
    
    const text = await response.text();
    console.log(`Resposta bruta: ${text}`);
    
    if (!text || text.trim() === '') {
      return []; 
    }

    const data = JSON.parse(text);
    return data;
  } catch (error) {
    throw new Error(`Falha na requisição: ${error.message}`);
  }
};


export const getAnexoDownloadUrl = (anexoId) => {
  return `${API_URL}anexos/${anexoId}/download`;
};

/**
 * 
 * @returns {Promise<Array>} 
 */
export const fetchCursos = async () => {

  const requestOptions = {
    method: 'GET',
  };

  try {
    const response = await fetch(`${API_URL}cursos`, requestOptions);
    if (!response.ok) {
      const errorBody = await response.text(); 
      throw new Error(`Erro ao buscar cursos: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};