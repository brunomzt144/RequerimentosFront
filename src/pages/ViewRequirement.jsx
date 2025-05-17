import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getRequirementById, 
  getAnexosByRequerimentoId, 
  getAnexoDownloadUrl, 
  getRequerimentoLogs,
  getAnexosByRequerimentoLog,
  downloadAnexoLog
} from '../services/api'; 

const ViewRequirement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [requirement, setRequirement] = useState(null);
  const [anexos, setAnexos] = useState([]);
  const [logHistory, setLogHistory] = useState(null);
  const [expandedLogs, setExpandedLogs] = useState({});
  const [logAnexos, setLogAnexos] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const reqData = await getRequirementById(id);
        setRequirement(reqData);
        
        const anexosData = await getAnexosByRequerimentoId(id);
        setAnexos(anexosData);
        
        // Fetch log history
        try {
          const logsData = await getRequerimentoLogs(id);
          setLogHistory(logsData);
          
          // Initialize expandedLogs state
          if (logsData && logsData.requerimentoLogs) {
            const initialExpandedState = {};
            logsData.requerimentoLogs.forEach(log => {
              initialExpandedState[log.idLog] = false;
            });
            setExpandedLogs(initialExpandedState);
          }
        } catch (logError) {
          console.error('Error fetching logs:', logError);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const toggleLogExpand = async (logId) => {
    // If expanding and we don't have anexos loaded for this log yet, fetch them
    if (!expandedLogs[logId] && !logAnexos[logId]) {
      try {
        console.log(`Fetching anexos for log ID: ${logId}`);
        const anexosData = await getAnexosByRequerimentoLog(logId);
        console.log('Received anexos data:', anexosData);
        setLogAnexos(prev => ({
          ...prev,
          [logId]: anexosData
        }));
      } catch (error) {
        console.error(`Error fetching anexos for log ${logId}:`, error);
      }
    }
    
    setExpandedLogs(prev => ({
      ...prev,
      [logId]: !prev[logId]
    }));
  };
  
  const handleDownloadAnexo = (anexoId, nome, extensao) => {
    const downloadUrl = getAnexoDownloadUrl(anexoId);
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${nome}.${extensao}`; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleDownloadLogAnexo = (requerimentoLogId, anexoId, nome, extensao) => {
    try {
      console.log(`Downloading anexo. RequerimentoLogId: ${requerimentoLogId}, AnexoId: ${anexoId}, Nome: ${nome}, Extensao: ${extensao}`);
      const fileName = `${nome || `anexo-${anexoId}`}${extensao ? `.${extensao}` : ''}`;
      downloadAnexoLog(requerimentoLogId, anexoId, fileName);
    } catch (error) {
      console.error('Error downloading anexo log:', error);
    }
  };
  
  const getStatusColor = (situacao) => {
    switch(situacao) {
      case 'DEFERIDO': return 'bg-green-500';
      case 'PENDENTE': return 'bg-yellow-500';
      case 'INDEFERIDO': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getFileIcon = (extensao) => {
    switch(extensao?.toLowerCase()) {
      case 'pdf': return '📄';
      case 'jpg':
      case 'jpeg':
      case 'png': return '🖼️';
      case 'doc':
      case 'docx': return '📝';
      case 'xls':
      case 'xlsx': return '📊';
      default: return '📎';
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '-';
    const date = new Date(dateTimeString);
    return date.toLocaleString('pt-BR');
  };
  
  const getOperationLabel = (operation) => {
    switch(operation) {
      case 'INSERT': return 'Criação';
      case 'UPDATE': return 'Atualização';
      case 'DELETE': return 'Exclusão';
      default: return operation;
    }
  };
  
  const handleGenerateReport = () => {
    // Implementation for report generation
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <p>Carregando dados do requerimento...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <p className="text-red-500">Erro: {error}</p>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
        >
          Voltar para o Dashboard
        </button>
      </div>
    );
  }

  if (!requirement) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <p>Requerimento não encontrado.</p>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
        >
          Voltar para o Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className={`${getStatusColor(requirement.situacao.toLowerCase())} text-white px-4 py-2 rounded-md mb-6 inline-block`}>
        {requirement.situacao}
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Nome do aluno</label>
          <input
            type="text"
            className="w-full p-3 bg-gray-100 rounded-md"
            value={requirement.nomeUsuario || 'N/A'}
            readOnly={true}
            disabled={true}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Finalidade do requerimento</label>
          <input
            type="text"
            className="w-full p-3 bg-gray-100 rounded-md"
            value={requirement.finalidade || 'N/A'}
            readOnly={true}
            disabled={true}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Justificativa do requerimento</label>
          <textarea
            className="w-full p-3 bg-gray-100 rounded-md min-h-[200px]"
            value={requirement.descricao || 'N/A'}
            readOnly={true}
            disabled={true}
          ></textarea>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Arquivos anexados</label>
          {anexos && anexos.length > 0 ? (
            <div className="space-y-2 mt-2">
              {anexos.map(anexo => (
                <div 
                  key={anexo.id}
                  className="bg-gray-100 p-3 rounded-md flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <span className="mr-2 text-xl">{getFileIcon(anexo.extensao)}</span>
                    <span>{anexo.nome}.{anexo.extensao}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      ({(anexo.tamanho / 1024).toFixed(2)} KB)
                    </span>
                  </div>
                  <button
                    onClick={() => handleDownloadAnexo(anexo.id, anexo.nome, anexo.extensao)}
                    className="bg-primary text-white px-3 py-1 rounded-md hover:bg-primary/90 transition-colors text-sm"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-2">Nenhum anexo disponível</p>
          )}
        </div>
        
        {/* Histórico de Alterações Section */}
        {logHistory && logHistory.requerimentoLogs && logHistory.requerimentoLogs.length > 0 && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h3 className="text-lg font-medium text-gray-800">Histórico de Alterações</h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {logHistory.requerimentoLogs.map((log) => (
                <div key={log.idLog} className="border-b border-gray-200 last:border-b-0">
                  <div 
                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleLogExpand(log.idLog)}
                  >
                    <div className="flex items-center">
                      <div className="mr-3 text-gray-400">
                        {expandedLogs[log.idLog] ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                            {getOperationLabel(log.operacao)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDateTime(log.dataOperacao)}
                          </span>
                        </div>
                        <div className="text-sm font-medium">
                          {log.nomeUsuarioOperacao || 'Usuário não especificado'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          log.situacao === 'P' ? 'bg-yellow-100 text-yellow-800' : 
                          log.situacao === 'D' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {log.situacaoDescricao}
                      </span>
                    </div>
                  </div>
                  
                  {expandedLogs[log.idLog] && (
                    <div className="p-4 bg-gray-50">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Finalidade</p>
                          <p className="text-sm">{log.descricaoFinalidade || 'Não especificada'}</p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-500">Data da operação</p>
                          <p className="text-sm">{formatDateTime(log.dataOperacao)}</p>
                        </div>
                      </div>
                      
                      {log.descricaoRequerimento && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500">Justificativa</p>
                          <p className="text-sm mt-1 p-2 bg-white rounded border border-gray-200">{log.descricaoRequerimento}</p>
                        </div>
                      )}
                      
                      {log.obsAlteracao && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500">Observação</p>
                          <p className="text-sm">{log.obsAlteracao}</p>
                        </div>
                      )}
                      
                      {/* Anexos associated with this log entry */}
                      <div className="mt-4">
                        <p className="text-xs text-gray-500 mb-2">Anexos deste requerimento</p>
                        
                        {logAnexos[log.idLog] ? (
                          logAnexos[log.idLog].length > 0 ? (
                            <div className="space-y-2">
                              {logAnexos[log.idLog].map(anexo => (
                                <div 
                                  key={anexo.idLog}
                                  className="bg-white p-3 rounded-md border border-gray-200 flex justify-between items-center"
                                >
                                  <div className="flex items-center">
                                    <span className="mr-2 text-xl">{getFileIcon(anexo.extensao)}</span>
                                    <span>{anexo.nome || `Anexo #${anexo.idAnexo}`}{anexo.extensao ? `.${anexo.extensao}` : ''}</span>
                                    <span className="ml-2 text-xs text-gray-500">
                                      ({anexo.tamanho ? (anexo.tamanho / 1024).toFixed(2) : '0'} KB)
                                    </span>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDownloadLogAnexo(log.idLog, anexo.idAnexo, anexo.nome, anexo.extensao);
                                    }}
                                    className="bg-primary text-white px-3 py-1 rounded-md hover:bg-primary/90 transition-colors text-sm"
                                  >
                                    Download
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">Nenhum anexo disponível para este registro</p>
                          )
                        ) : (
                          <p className="text-sm text-gray-500">Carregando anexos...</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <button
          onClick={handleGenerateReport}
          className="w-full py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Gerar relatório
        </button>
      </div>
    </div>
  );
};

export default ViewRequirement;