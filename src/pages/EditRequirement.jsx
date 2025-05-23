import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getRequirementById, 
  getAnexosByRequerimentoId, 
  getAnexoDownloadUrl,
  updateRequirementStatus 
} from '../services/api'; 

const EditRequirement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [requirement, setRequirement] = useState(null);
  const [anexos, setAnexos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const reqData = await getRequirementById(id);
        setRequirement(reqData);

        const anexosData = await getAnexosByRequerimentoId(id);
        setAnexos(anexosData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  

  
  const getStatusColor = (situacao) => {
    switch(situacao) {
      case 'APROVADO': return 'bg-green-500';
      case 'PENDENTE': return 'bg-yellow-500';
      case 'REJEITADO': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getFileIcon = (extensao) => {
    switch(extensao.toLowerCase()) {
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
  
  const handleApprove = async () => {
    try {
      setUpdating(true);
      await updateRequirementStatus(id, 'D'); // 'D' Deferido
      navigate('/dashboard');
    } catch (err) {
      setError(`Erro ao aprovar requerimento: ${err.message}`);
      setUpdating(false);
    }
  };
  
  const handleReject = async () => {
    try {
      setUpdating(true);
      await updateRequirementStatus(id, 'I'); // 'I' Indeferido
      navigate('/dashboard');
    } catch (err) {
      setError(`Erro ao rejeitar requerimento: ${err.message}`);
      setUpdating(false);
    }
  };
  
  const handleGenerateReport = () => {
    // Future implementation
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
      <div className={`${getStatusColor(requirement.situacao)} text-white px-4 py-2 rounded-md mb-6 inline-block`}>
        {requirement.situacao}
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Nome do aluno</label>
          <input
            type="text"
            className="w-full p-3 bg-gray-100 rounded-md"
            value={requirement.nomeUsuario || 'Vazio'}
            readOnly
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Finalidade do requerimento</label>
          <input
            type="text"
            className="w-full p-3 bg-gray-100 rounded-md"
            value={requirement.finalidade || 'Vazio'}
            readOnly
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Justificativa do requerimento</label>
          <textarea
            className="w-full p-3 bg-gray-100 rounded-md min-h-[200px]"
            value={requirement.descricao || 'Vazio'}
            readOnly
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
                    <span>{anexo.nome}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      ({(anexo.tamanho / 1024).toFixed(2)} KB)
                    </span>
                    <a 
                      href={getAnexoDownloadUrl(anexo.id)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-500 text-xs hover:underline"
                    >
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-2">Nenhum anexo disponível</p>
          )}
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={handleApprove}
            disabled={updating}
            className={`flex-1 py-3 ${updating ? 'bg-gray-300' : 'bg-primary hover:bg-primary/90'} text-white rounded-md transition-colors`}
          >
            {updating ? 'Processando...' : 'Deferir'}
          </button>
          
          <button
            onClick={handleReject}
            disabled={updating}
            className={`flex-1 py-3 ${updating ? 'bg-gray-300' : 'bg-red-500 hover:bg-red-600'} text-white rounded-md transition-colors`}
          >
            {updating ? 'Processando...' : 'Rejeitar'}
          </button>
        </div>
        
        <button
          onClick={handleGenerateReport}
          disabled={updating}
          className="w-full py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Gerar relatório
        </button>
      </div>
    </div>
  );
};

export default EditRequirement;