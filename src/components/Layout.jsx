import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user } = useAuth();
  const userName = user?.name || "Aluno";
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar userName={userName} />
      
      <div className="flex-1 overflow-auto">
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;