import React from 'react';
import { Link } from 'react-router-dom';
import { Filter, FileText, Eye, Edit, Trash } from 'lucide-react';

const requirements = [
  {
    id: 1,
    title: 'Discente',
    course: 'Curso',
    reason: 'Motivo requerimento',
    status: 'approved'
  },
  {
    id: 2,
    title: 'Discente',
    course: 'Curso',
    reason: 'Motivo requerimento',
    status: 'pending'
  },
  {
    id: 3,
    title: 'Discente',
    course: 'Curso',
    reason: 'Motivo requerimento',
    status: 'rejected'
  },
  {
    id: 4,
    title: 'Discente',
    course: 'Curso',
    reason: 'Motivo requerimento',
    status: 'approved'
  },
  {
    id: 5,
    title: 'Discente',
    course: 'Curso',
    reason: 'Motivo requerimento',
    status: 'approved'
  }
];

const getStatusColor = (status) => {
  switch(status) {
    case 'approved': return 'bg-green-500';
    case 'pending': return 'bg-yellow-500';
    case 'rejected': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getStatusText = (status) => {
  switch(status) {
    case 'approved': return 'Situação';
    case 'pending': return 'Situação';
    case 'rejected': return 'Situação';
    default: return 'Situação';
  }
};

const Dashboard = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <Link 
          to="/new-requirement"
          className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
        >
          Novo requerimento
        </Link>
        
        <div className="flex items-center">
          <div className="relative">
            <input
              type="text"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary w-64"
              placeholder="Termo de pesquisa"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={18} className="text-gray-400" />
            </div>
          </div>
          <select className="border border-gray-300 rounded-r-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary border-l-0">
            <option value="">Situação</option>
            <option value="approved">Aprovado</option>
            <option value="pending">Pendente</option>
            <option value="rejected">Rejeitado</option>
          </select>
        </div>
      </div>
      
      <div className="bg-white rounded-md shadow">
        {requirements.map((req) => (
          <div 
            key={req.id}
            className="border-b last:border-b-0 p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{req.title}</h3>
              <p className="text-sm text-gray-600">{req.course}</p>
              <p className="text-sm text-gray-600">{req.reason}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`${getStatusColor(req.status)} text-white px-3 py-1 rounded-full text-sm`}>
                {getStatusText(req.status)}
              </div>
              
              <div className="flex gap-2">
                <Link to={`/requirement/${req.id}`} className="text-gray-500 hover:text-primary">
                  <FileText size={20} />
                </Link>
                <Link to={`/requirement/${req.id}`} className="text-gray-500 hover:text-primary">
                  <Eye size={20} />
                </Link>
                <Link to={`/requirement/${req.id}/edit`} className="text-gray-500 hover:text-primary">
                  <Edit size={20} />
                </Link>
                <button className="text-gray-500 hover:text-red-500">
                  <Trash size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
