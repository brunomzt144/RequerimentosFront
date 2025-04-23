import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock } from 'lucide-react';
import { toast } from 'react-toastify';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          login: username,
          password: password
        })
      };
      const response = await fetch('http://localhost:8080/auth/login', requestOptions);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro: ${errorText || response.status}`);
      }
      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      const userData = {
        name: username, 
        token: data.token
      };
      const success = login(userData);
      
      if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login. Please try again.');
      setError(error.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
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
        <h2 className="text-center text-2xl font-semibold text-primary mb-6">Login</h2>
       
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              <User size={20} />
            </div>
            <input
              type="text"
              className="w-full py-3 pl-10 pr-4 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
         
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              <Lock size={20} />
            </div>
            <input
              type="password"
              className="w-full py-3 pl-10 pr-4 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          {error && <div className="text-red-500 text-sm">{error}</div>}
         
          <button
            type="submit"
            className="w-full py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Acessar'}
          </button>
         
          <Link
            to="/register"
            className="block w-full py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-center"
          >
            Cadastrar-se
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;