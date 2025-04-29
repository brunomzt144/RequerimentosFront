import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Mail, FileText } from 'lucide-react';
import CursoComboBox from '../components/CursoComboBox';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    cpf: '',
    cursoId: null
  });
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleCursoSelect = (curso) => {
    setFormData({
      ...formData,
      cursoId: curso ? curso.id : null
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password, email, cpf, cursoId } = formData;
    
    if (username && password && email && cpf && cursoId) {
      const success = register(formData);
      if (success) {
        navigate('/');
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="mb-8">
        <img src="/ifsc-logo.svg" alt="IFSC Logo" className="w-24 h-24 mx-auto" />
        <h1 className="text-center text-2xl font-bold mt-2">INSTITUTO FEDERAL</h1>
        <h2 className="text-center text-xl">Santa Catarina</h2>
      </div>
      
      <div className="w-full max-w-md">
        <h2 className="text-center text-2xl font-semibold text-primary mb-6">Cadastre seu usuário</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              <User size={20} />
            </div>
            <input
              type="text"
              name="username"
              className="w-full py-3 pl-10 pr-4 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Usuário"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              <Lock size={20} />
            </div>
            <input
              type="password"
              name="password"
              className="w-full py-3 pl-10 pr-4 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Senha"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              <Mail size={20} />
            </div>
            <input
              type="email"
              name="email"
              className="w-full py-3 pl-10 pr-4 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              <FileText size={20} />
            </div>
            <input
              type="text"
              name="cpf"
              className="w-full py-3 pl-10 pr-4 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="CPF"
              value={formData.cpf}
              onChange={handleChange}
            />
          </div>
          
          {/* Add the Curso ComboBox */}
          <CursoComboBox onSelect={handleCursoSelect} />
          
          <button 
            type="submit" 
            className="w-full py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Cadastre-se
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;