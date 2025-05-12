import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import ifscLogo from '../assets/ifsc_logo.png';





const Sidebar = ({ userName = "Aluno" }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = () => {

    logout();
    navigate('/');
  };

  return (
    <div className="w-[90px] min-h-screen bg-sidebar flex flex-col items-center justify-between py-4 border-r border-gray-200">
      <div className="flex flex-col items-center gap-2">
        <Link to="/dashboard">
        <img src={ifscLogo} alt="IFSC Logo" className="w-24 h-auto" />
        </Link>
      </div>
      
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center">
          <p className="text-xs text-center mt-1">{userName}</p>
          <p className="text-xs text-gray-500"></p>
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