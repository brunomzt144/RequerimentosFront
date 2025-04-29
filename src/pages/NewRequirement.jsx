import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, FileText } from 'lucide-react';
import { fetchFinalidade, createRequerimento } from '../services/api';

const NewRequirement = () => {
  const [formData, setFormData] = useState({
    purpose: '',
    justification: '',
    agree: false
  });
  
  const [finalidades, setFinalidades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    const carregarFinalidades = async () => {
      try {
        setIsLoading(true);
        const data = await fetchFinalidade();
        setFinalidades(data);
      } catch (err) {
        console.error('Erro ao carregar finalidades:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    carregarFinalidades();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    console.log('Files selected:', files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const removeFile = (index) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.purpose || !formData.justification || !formData.agree) {
      alert('Por favor, preencha todos os campos obrigatórios e concorde com os termos.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call the API function to create requerimento
      const result = await createRequerimento(
        formData.purpose,
        formData.justification,
        uploadedFiles
      );
      
      console.log('Requerimento criado com sucesso:', result);
      
      // Navigate to dashboard after successful submission
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">Novo Requerimento</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Finalidade do requerimento</label>
          {isLoading ? (
            <p className="text-sm text-gray-500">Carregando finalidades</p>
          ) : error ? (
            <p className="text-sm text-red-500">Erro ao carregar finalidades: {error}</p>
          ) : (
            <select
              name="purpose"
              className="w-full p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.purpose}
              onChange={handleChange}
              required
            >
              <option value="">Selecione uma finalidade</option>
              {finalidades.map((finalidade) => (
                <option key={finalidade.id} value={finalidade.id}>
                  {finalidade.descricao}
                </option>
              ))}
            </select>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Justificativa do requerimento</label>
          <textarea
            name="justification"
            className="w-full p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[200px]"
            placeholder="Detalhe sua solicitação"
            value={formData.justification}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Anexo de arquivos</label>
          <p className="text-xs text-gray-500 mb-2">
            Deve ser disponibilizada a cópia de documentos originais, com assinatura e/ou carimbo ou outro documento comprobatório da instituição de origem, ou que seja possível a consulta e/ou certificação em meio digital.
          </p>
          <p className="text-xs text-gray-500 mb-2">
            Faça upload de até 10 arquivos aceitos: PDF, document, image ou spreadsheet. O tamanho máximo é de 100 MB por item.
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
          
          {/* Display uploaded files */}
          {uploadedFiles.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Arquivos anexados:</h3>
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
            name="agree"
            className="mt-1 mr-2"
            checked={formData.agree}
            onChange={handleChange}
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
            disabled={!formData.agree || isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Confirmar'}
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

export default NewRequirement;