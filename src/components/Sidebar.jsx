import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const Sidebar = ({ userName = "Aluno" }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, you would clear authentication state here
    navigate('/');
  };

  return (
    <div className="w-[90px] min-h-screen bg-sidebar flex flex-col items-center justify-between py-4 border-r border-gray-200">
      <div className="flex flex-col items-center gap-2">
        <Link to="/dashboard">
          <img src="/ifsc-logo.svg" alt="IFSC Logo" className="w-12 h-12" />
        </Link>
      </div>
      
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            😊
          </div>
          <p className="text-xs text-center mt-1">{userName}</p>
          <p className="text-xs text-gray-500">aluno@ifsc.edu.br</p>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors"
        >
          <LogOut size={16} />
          <span className="text-sm">Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;