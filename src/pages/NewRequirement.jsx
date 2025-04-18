import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

const NewRequirement = () => {
  const [formData, setFormData] = useState({
    purpose: '',
    justification: '',
    files: [],
    agree: false
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileUpload = (e) => {
    // In a real app, you would handle file uploads to a server
    console.log('Files selected:', e.target.files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log('Form submitted:', formData);
    navigate('/dashboard');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">Novo Requerimento</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Finalidade do requerimento</label>
          <select
            name="purpose"
            className="w-full p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={formData.purpose}
            onChange={handleChange}
          >
            <option value="">Selecione uma finalidade</option>
            <option value="matricula">Matrícula</option>
            <option value="transferencia">Transferência</option>
            <option value="documentos">Solicitação de documentos</option>
            <option value="outros">Outros</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Justificativa do requerimento</label>
          <textarea
            name="justification"
            className="w-full p-3 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[200px]"
            placeholder="Detalhe sua solicitação"
            value={formData.justification}
            onChange={handleChange}
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
          
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
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
        </div>
        
        <div className="flex items-start">
          <input
            type="checkbox"
            id="agree"
            name="agree"
            className="mt-1 mr-2"
            checked={formData.agree}
            onChange={handleChange}
          />
          <label htmlFor="agree" className="text-sm">
            Declaro que as informações acima prestadas são verdadeiras e assumo a inteira responsabilidade pelas mesmas.
          </label>
        </div>
        
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            disabled={!formData.agree}
          >
            Confirmar
          </button>
          
          <button
            type="button"
            className="flex-1 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            onClick={() => navigate('/dashboard')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewRequirement;