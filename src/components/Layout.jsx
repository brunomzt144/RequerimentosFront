import React from 'react';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';

const Layout = ({ children, userName }) => {
  const location = useLocation();
  
  // Don't show sidebar on login and register pages
  const hideOnPaths = ['/', '/register'];
  const showSidebar = !hideOnPaths.includes(location.pathname);

  return (
    <div className="flex min-h-screen bg-background">
      {showSidebar && <Sidebar userName={userName} />}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default Layout;
