import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Mock data - in a real app this would come from an API
const requirementData = {
  id: 1,
  status: 'pending',
  studentName: 'Nome do aluno',
  purpose: 'Finalidade do requerimento',
  justification: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  attachments: [
    { id: 1, name: 'Anexo 1' },
    { id: 2, name: 'Anexo 2' },
    { id: 3, name: 'Anexo 3' },
  ]
};

const ViewRequirement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // In a real app, you would fetch the requirement data based on the ID
  
  const getStatusColor = () => {
    switch(requirementData.status) {
      case 'approved': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleApprove = () => {
    // In a real app, you would send this action to your backend
    console.log('Approving requirement:', id);
    navigate('/dashboard');
  };

  const handleReject = () => {
    // In a real app, you would send this action to your backend
    console.log('Rejecting requirement:', id);
    navigate('/dashboard');
  };

  const handleGenerateReport = () => {
    // In a real app, you would generate a report on the backend
    console.log('Generating report for requirement:', id);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className={`${getStatusColor()} text-white px-4 py-2 rounded-md mb-6 inline-block`}>
        Situação
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Nome do aluno</label>
          <input
            type="text"
            className="w-full p-3 bg-gray-100 rounded-md"
            value={requirementData.studentName}
            readOnly
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Finalidade do requerimento</label>
          <input
            type="text"
            className="w-full p-3 bg-gray-100 rounded-md"
            value={requirementData.purpose}
            readOnly
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Justificativa do requerimento</label>
          <textarea
            className="w-full p-3 bg-gray-100 rounded-md min-h-[200px]"
            value={requirementData.justification}
            readOnly
          ></textarea>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Arquivos anexados</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {requirementData.attachments.map(attachment => (
              <div 
                key={attachment.id}
                className="bg-gray-100 px-4 py-2 rounded-full text-sm"
              >
                {attachment.name}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={handleApprove}
            className="flex-1 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Deferir
          </button>
          
          <button
            onClick={handleReject}
            className="flex-1 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Rejeitar
          </button>
        </div>
        
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