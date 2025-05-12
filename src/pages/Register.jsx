import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Mail, FileText } from 'lucide-react';
import CursoComboBox from '../components/CursoComboBox';
import ifscLogo from '../assets/ifsc_logo.png';


const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    cpf: '',
    cursoId: null
  });

  const [errors, setErrors] = useState({
    username: '',
    password: '',
    email: '',
    cpf: '',
    cursoId: ''
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
    if (validateForm()) {
      const { username, password, email, cpf, cursoId } = formData;

      if (username && password && email && cpf && cursoId) {
        const success = register(formData);
        if (success) {
          navigate('/');
        }
      }
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: '',
      password: '',
      email: '',
      cpf: '',
      cursoId: ''
    };

    if (!formData.username.trim()) {
      newErrors.username = 'Usuário é obrigatório';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'E-mail é obrigatório';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
      isValid = false;
    }

    // CPF 
    if (!formData.cpf) {
      newErrors.cpf = 'CPF é obrigatório';
      isValid = false;
    }

    // Curso validation
    if (!formData.cursoId) {
      newErrors.cursoId = 'Selecione um curso';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="mb-8">
        <Link to="/">
          <img src={ifscLogo} alt="IFSC Logo" className="w-24 h-24 mx-auto" />
        </Link>
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
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
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
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
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
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
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
            {errors.cpf && (
              <p className="text-red-500 text-xs mt-1">{errors.cpf}</p>
            )}
          </div>

          {/* Add the Curso ComboBox */}

          <div>
            <CursoComboBox onSelect={handleCursoSelect} />
            {errors.cursoId && (
              <p className="text-red-500 text-xs mt-1">{errors.cursoId}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Cadastre-se
          </button>
        </form>
      </div >
    </div >
  );
};

export default Register;