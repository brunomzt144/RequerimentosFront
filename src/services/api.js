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
 * 'Login' user and get authentication token
 * @param {string} username - User's login
 * @param {string} password - User's password
 * @returns {Promise<Object>} - User data and token
 */
export const loginUsuario = async (username, password) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      login: username,
      password: password
    })
  };
  try {
    const response = await fetch(`${API_URL}auth/login`, requestOptions);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro: ${errorText || response.status}`);
    }
    const data = await response.json();

    const role = decodeJWTRole(data.token);

    return {
      token: data.token,
      user: {
        name: username,
        role: role || 'USER'
      }
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Decode JWT token and extract the role claim
 * @param {string} token - JWT token
 * @returns {string|null} - Role from token or null if not found
 */
function decodeJWTRole(token) {
  try {
    const payload = token.split('.')[1];

    const decodedPayload = atob(payload);

    const payloadData = JSON.parse(decodedPayload);

    return payloadData.role;
  } catch (error) {
    return null;
  }
}



/**
 * Busca finalidade
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
 * Pega requerimentos do usuário autenticado com paginação e filtro por ano
 * @param {number} page - Número da página (começando em 0)
 * @param {number} size - Quantidade de itens por página
 * @param {number|string} year - Ano para filtrar os requerimentos (opcional)
 * @returns {Promise<Object>} - Objeto com os requerimentos paginados
 */
export const fetchRequirements = async (page = 0, size = 10, year = '') => {
  try {
    // Verificar token
    const token = getAuthToken();
    if (!token) {
      throw new Error('Token de autenticação não encontrado');
    }
 
    const userId = extractUserIdFromToken(token);
    if (!userId) {
      throw new Error('Não foi possível extrair o ID do usuário do token');
    }
   
    // Construir URL com parâmetros de paginação e filtro por ano
    let url = `${API_URL}requerimentos/usuario/${userId}?page=${page}&size=${size}`;
    if (year) {
      url += `&year=${year}`;
    }
   
    const requestOptions = {
      method: 'GET',
      headers: getHeaders()
    };
   
    console.log(`Fetching from URL: ${url}`);
    const response = await fetch(url, requestOptions);
   
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${errorText || response.statusText}`);
    }
   
    return await response.json();
   
  } catch (error) {
    console.error('Erro ao buscar requerimentos:', error);
    throw error;
  }
};

/**
 * Extrai o ID do usuário de um token JWT
 * @param {string} token - Token JWT
 * @returns {string|null} - ID do usuário ou null se não for possível extrair
 */
const extractUserIdFromToken = (token) => {
  try {
    // Dividir token e obter payload
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Formato de token inválido');
      return null;
    }
    
    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = atob(base64);
    
    const data = JSON.parse(decodedPayload);
    
    return data.user_id;
    
  } catch (error) {
    console.error('Erro ao processar token JWT:', error);
    return null;
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




/**
 * Update an existing requerimento
 * @param {number} id - ID of the requirement to update
 * @param {string} finalidade - Purpose ID
 * @param {string} justificativa - Description/justification text
 * @param {File[]} newFiles - New files to upload
 * @param {Object[]} existingFiles - Existing files to keep
 * @returns {Promise<Object>}
 */
export const updateRequerimento = async (id, finalidade, descricao, newFiles = [], existingFiles = []) => {
  const token = getAuthToken();

  const formData = new FormData();
  formData.append('finalidade', finalidade);
  formData.append('justificativa', descricao);

  if (existingFiles.length > 0) {
    const existingFileIds = existingFiles.map(file => file.id).join(',');
    formData.append('manterAnexos', existingFileIds);
  }


  if (newFiles.length > 0) {
    newFiles.forEach((file) => {
      formData.append('files', file);
    });
  }

  const headers = {
    'Authorization': `Bearer ${token}`
  };

  try {
    const response = await fetch(`${API_URL}requerimentos/${id}`, {
      method: 'PUT',
      headers: headers,
      body: formData
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Erro ao atualizar requerimento: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};




/** Get anexo de um requerimento **/
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



/**
 *
 * @param {number} id 
 * @param {string} situacao 
 * @returns {Promise<Object>} 
 */
export const updateRequirementStatus = async (id, situacao) => {
  const requestOptions = {
    method: 'PUT',
    headers: getHeaders()
  };

  try {
    const response = await fetch(`${API_URL}requerimentos/${id}/situacao?situacao=${situacao}`, requestOptions);
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Erro ao atualizar situação: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};


/**
 * Fetches anexos associated with a specific requerimento log
 * @param {number} requerimentoLogId - ID of the requerimento log
 * @returns {Promise<Array>} - List of anexos for the log
 */
export const getAnexosByRequerimentoLog = async (requerimentoLogId) => {

   const requestOptions = {
    method: 'GET',
    headers: getHeaders()
  };

  try {

    console.log(requerimentoLogId)
    const response = await fetch(`${API_URL}anexos/log/requerimento-log/${requerimentoLogId}`,requestOptions);
    
    if (!response.ok) {
      console.log(`Erro ao buscar anexos: ${response.status}`)
      throw new Error(`Erro ao buscar anexos: ${response.status}`);
      
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar anexos por log:', error);
    throw error;
  }
};

/**
 * Downloads an anexo from a specific requerimento log
 * @param {number} requerimentoLogId - ID of the requerimento log
 * @param {number} anexoId - ID of the anexo to download
 * @param {string} fileName - Optional filename for the download
 */
export const downloadAnexoLog = (requerimentoLogId, anexoId, fileName) => {
  const url = `${API_URL}anexos/log/requerimento-log/${requerimentoLogId}/anexo/${anexoId}/download`;
  
  const link = document.createElement('a');
  link.href = url;
  if (fileName) {
    link.download = fileName;
  }
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Get log history for a requerimento
 * @param {number} requerimentoId - ID of the requerimento
 * @returns {Promise<Object>} - Log history data
 */
export const getRequerimentoLogs = async (requerimentoId) => {
  try {
    const token = getAuthToken();
    const requestOptions = {
      method: 'GET',
      headers: token ? getHeaders() : {}
    };

    const response = await fetch(`${API_URL}requerimentos/logs/${requerimentoId}`, requestOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao buscar histórico: ${errorText || response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching logs:', error);
    throw error;
  }
};