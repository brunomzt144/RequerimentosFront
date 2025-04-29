import React, { useState, useEffect } from 'react';
import { fetchCursos } from '../services/api';
import { Briefcase } from 'lucide-react'; // Import Briefcase icon for consistency

const CursoComboBox = ({ onSelect, className }) => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCurso, setSelectedCurso] = useState('');

  useEffect(() => {
    const loadCursos = async () => {
      try {
        setLoading(true);
        const data = await fetchCursos();
        setCursos(data);
        setError(null);
      } catch (err) {
        setError(`Erro ao carregar cursos: ${err.message}`);
        console.error('Erro ao carregar cursos:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCursos();
  }, []);

  const handleChange = (e) => {
    const cursoId = e.target.value;
    setSelectedCurso(cursoId);
   
    if (onSelect) {
      const selectedCursoObj = cursos.find(curso => curso.id.toString() === cursoId);
      onSelect(selectedCursoObj);
    }
  };

  if (loading) return <p className="py-3 text-center text-gray-500">Carregando cursos...</p>;
  if (error) return <p className="py-3 text-center text-red-500">{error}</p>;

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
        <Briefcase size={20} />
      </div>
      <select
        id="curso"
        className="w-full py-3 pl-10 pr-4 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        value={selectedCurso}
        onChange={handleChange}
      >
        <option value="">Selecione um curso</option>
        {cursos.map((curso) => (
          <option key={curso.id} value={curso.id}>
            {curso.nome}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CursoComboBox;