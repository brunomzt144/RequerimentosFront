import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { loginUsuario } from '../services/api';
import ifscLogo from '../assets/ifsc_logo.png';

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
      const data = await loginUsuario(username, password);

      localStorage.setItem('authToken', data.token);

      const success = login(data.user, data.token);

      if (success) {
        toast.success('Login successful!');
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
        <img src={ifscLogo} alt="IFSC Logo" className="w-24 h-24 mx-auto" />
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