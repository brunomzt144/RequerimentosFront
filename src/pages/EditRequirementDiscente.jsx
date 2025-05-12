import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, X, FileText } from 'lucide-react';
import { 
  fetchFinalidade, 
  getRequirementById, 
  updateRequerimento, 
  getAnexosByRequerimentoId, 
  getAnexoDownloadUrl 
} from '../services/api';

const EditRequirementDiscente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Main states
  const [requirement, setRequirement] = useState(null);
  const [finalidades, setFinalidades] = useState([]);
  const [anexos, setAnexos] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agree, setAgree] = useState(false);
  
  // Selected finalidade (for the dropdown)
  const [selectedFinalidade, setSelectedFinalidade] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Load requirement data
        const reqData = await getRequirementById(id);
        setRequirement(reqData);
        setAgree(true);
        
        // Load finalidades
        const finalidadesData = await fetchFinalidade();
        setFinalidades(finalidadesData);
        
        // Find matching finalidade ID
        const matchingFinalidade = finalidadesData.find(f => 
          f.descricao === reqData.finalidade
        );
        if (matchingFinalidade) {
          setSelectedFinalidade(matchingFinalidade.id.toString());
        }
        
        // Load anexos
        const anexosData = await getAnexosByRequerimentoId(id);
        setAnexos(anexosData || []);
        
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message || 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const handleFinalidadeChange = (e) => {
    setSelectedFinalidade(e.target.value);
  };
  
  const handleDescricaoChange = (e) => {
    setRequirement({
      ...requirement,
      descricao: e.target.value
    });
  };
  
  const handleAgreeChange = (e) => {
    setAgree(e.target.checked);
  };
  
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };
  
  const removeFile = (index) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
  };
  
  const removeExistingFile = (index) => {
    const updatedAnexos = [...anexos];
    updatedAnexos.splice(index, 1);
    setAnexos(updatedAnexos);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFinalidade || !requirement.descricao || !agree) {
      alert('Por favor, preencha todos os campos obrigatórios e concorde com os termos.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Submitting update with data:', {
        id,
        finalidade: selectedFinalidade,
        descricao: requirement.descricao,
        uploadedFiles,
        anexos
      });
      
      const result = await updateRequerimento(
        id,
        selectedFinalidade,
        requirement.descricao,
        uploadedFiles,
        anexos
      );
      
      console.log('Requerimento atualizado com sucesso:', result);
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao atualizar requerimento:', error);
      setError(error.message || 'Erro ao atualizar requerimento');
    } finally {
      setIsSubmitting(false);
    }
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
      <h2 className="text-xl font-semibold mb-6">Editar Requerimento</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
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
          <select
            className="w-full p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={selectedFinalidade}
            onChange={handleFinalidadeChange}
            required
          >
            <option value="">Selecione uma finalidade</option>
            {finalidades.map((finalidade) => (
              <option key={finalidade.id} value={finalidade.id.toString()}>
                {finalidade.descricao}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Justificativa do requerimento</label>
          <textarea
            className="w-full p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[200px]"
            placeholder="Detalhe sua solicitação"
            value={requirement.descricao || ''}
            onChange={handleDescricaoChange}
            required
          ></textarea>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Anexo de arquivos</label>
          <p className="text-xs text-gray-500 mb-2">
            Deve ser disponibilizada a cópia de documentos originais, com assinatura e/ou carimbo ou outro documento comprobatório da instituição de origem, ou que seja possível a consulta e/ou certificação em meio digital.
          </p>
          <p className="text-xs text-gray-500 mb-2">
            Faça upload de até 10 arquivos aceitos: PDF, document, image ou spreadsheet. O tamanho máximo é de 10 MB por item.
          </p>
          
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center mb-4">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              multiple
              onChange={handleFileUpload}
            />
            <label 
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Plus className="text-primary mb-2" size={24} />
              <span className="text-primary text-sm font-medium">Adicionar arquivos</span>
            </label>
          </div>
          
          {/* Display existing files */}
          {anexos.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Arquivos já anexados:</h3>
              <ul className="space-y-2">
                {anexos.map((anexo, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    <div className="flex items-center">
                      <FileText size={16} className="mr-2 text-gray-600" />
                      <span className="text-sm truncate">{anexo.nome}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({(anexo.tamanho / 1024 / 1024).toFixed(2)} MB)
                      </span>
                      <a 
                        href={getAnexoDownloadUrl(anexo.id)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-500 text-xs hover:underline"
                      >
                        Visualizar
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExistingFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Display newly uploaded files */}
          {uploadedFiles.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Novos arquivos anexados:</h3>
              <ul className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    <div className="flex items-center">
                      <FileText size={16} className="mr-2 text-gray-600" />
                      <span className="text-sm truncate">{file.name}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="flex items-start">
          <input
            type="checkbox"
            id="agree"
            className="mt-1 mr-2"
            checked={agree}
            onChange={handleAgreeChange}
            required
          />
          <label htmlFor="agree" className="text-sm">
            Declaro que as informações acima prestadas são verdadeiras e assumo a inteira responsabilidade pelas mesmas.
          </label>
        </div>
        
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            disabled={!agree || isSubmitting}
          >
            {isSubmitting ? 'Atualizando...' : 'Salvar Alterações'}
          </button>
          
          <button
            type="button"
            className="flex-1 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            onClick={() => navigate('/dashboard')}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRequirementDiscente;