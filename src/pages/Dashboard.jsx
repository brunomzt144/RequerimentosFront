import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Filter, FileText, Eye, Edit, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { fetchRequirements } from '../services/api';
import { useAuth } from '../context/AuthContext';

const getStatusColor = (status) => {
    switch(status) {
        case 'DEFERIDO': return 'bg-green-500';
        case 'PENDENTE':return 'bg-yellow-500';
        case 'INDEFERIDO': return 'bg-red-500';
        default: return 'bg-gray-500';
    }
};

const getStatusText = (status) => {
    switch(status) {
        case 'DEFERIDO': return 'Deferido';
        case 'PENDENTE': return 'Pendente';
        case 'INDEFERIDO': return 'Indeferido';
        default: return 'Situação';
    }
};

const formatarData = (dataString) => {
    if (!dataString) return '';
    const [ano, mes, dia] = dataString.split('T')[0].split('-');
    return `${dia}/${mes}/${ano}`;
};

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    // State for requirements and filtering
    const [requirements, setRequirements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);


    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

    useEffect(() => {
        const getRequirements = async () => {
            setLoading(true);
            try {
     
                const response = await fetchRequirements(currentPage, pageSize, yearFilter);
                setRequirements(response.content);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        getRequirements();
    }, [currentPage, pageSize, yearFilter]);

    const handleEditClick = (reqId) => {
        if (user && user.role === 'ADMIN') {
            navigate(`/edit-requirement/${reqId}`);
        } else {
            navigate(`/edit-requirement-discente/${reqId}`);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handlePageSizeChange = (e) => {
        setPageSize(parseInt(e.target.value));
        setCurrentPage(0); 
    };

    const handleYearFilterChange = (e) => {
        setYearFilter(e.target.value);
        setCurrentPage(0);
    };
    
    const filteredRequirements = requirements.filter(req => {
        const matchesSearch =
            searchTerm === '' ||
            req.nomeUsuario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.nomeCurso?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.finalidade?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === '' ||
            req.situacao === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading && currentPage === 0) {
        return <div className="p-6 flex justify-center">Carregando requerimentos...</div>;
    }
    
    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                <Link
                    to="/new-requirement"
                    className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
                >
                    Novo requerimento
                </Link>
                <div className="flex flex-col md:flex-row items-center gap-2">
                    <div className="relative w-full md:w-auto">
                        <input
                            type="text"
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-64"
                            placeholder="Termo de pesquisa"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Filter size={18} className="text-gray-400" />
                        </div>
                    </div>
                    <select
                        className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-auto"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">Todas as situações</option>
                        <option value="DEFERIDO">Deferido</option>
                        <option value="PENDENTE">Pendente</option>
                        <option value="INDEFERIDO">Indeferido</option>
                    </select>
                    <div className="relative w-full md:w-auto">
                        <select
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-auto"
                            value={yearFilter}
                            onChange={handleYearFilterChange}
                        >
                            <option value="">Todos os anos</option>
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar size={18} className="text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-md shadow">
                {filteredRequirements.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        {error ? (
                            `Erro ao carregar requerimentos: ${error}`
                        ) : yearFilter ? (
                            `Nenhum requerimento encontrado para o ano ${yearFilter}`
                        ) : (
                            'Nenhum requerimento encontrado'
                        )}
                    </div>
                ) : (
                    <>
                        {filteredRequirements.map((req) => (
                            <div
                                key={req.id}
                                className="border-b last:border-b-0 p-4 flex justify-between items-center"
                            >
                                <div>
                                    <h3 className="font-semibold">{req.nomeUsuario}</h3>
                                    <p className="text-sm text-gray-600">{req.nomeCurso}</p>
                                    <p className="text-sm text-gray-600">{req.finalidade}</p>
                                    {req.dataCriacao && (
                                        <p className="text-xs text-gray-500">
                                            Criado em: {formatarData(req.dataCriacao)}
                                        </p>
                                    )}
                                    {req.dataAlteracao && (
                                        <p className="text-xs text-gray-500">
                                            Atualizado em: {formatarData(req.dataAlteracao)}
                                        </p>
                                    )}
                                    {req.quantidadeAnexos > 0 && (
                                        <p className="text-xs text-gray-500">
                                            Anexos: {req.quantidadeAnexos} | ID: {req.id}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className={`${getStatusColor(req.situacao)} text-white px-3 py-1 rounded-full text-sm`}>
                                        {getStatusText(req.situacao)}
                                    </div>
                                    <div className="flex gap-2">
                                        <Link to={`/requirement/${req.id}`} className="text-gray-500 hover:text-primary">
                                            <FileText size={20} />
                                        </Link>
                                        <Link to={`/requirement/${req.id}`} className="text-gray-500 hover:text-primary">
                                            <Eye size={20} />
                                        </Link>
                                        <button 
                                            onClick={() => handleEditClick(req.id)} 
                                            className="text-gray-500 hover:text-primary border-none bg-transparent cursor-pointer p-0 m-0"
                                        >
                                            <Edit size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
            
            {/* Pagination controls */}
            <div className="mt-4 flex flex-col md:flex-row items-center justify-between">
                <div className="text-sm text-gray-500 mb-2 md:mb-0">
                    Exibindo {filteredRequirements.length} de {totalElements} requerimentos
                    {yearFilter && ` do ano ${yearFilter}`}
                </div>
                <div className="flex items-center gap-2">
                    <select
                        className="border border-gray-300 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        value={pageSize}
                        onChange={handlePageSizeChange}
                    >
                        <option value="5">5 por página</option>
                        <option value="10">10 por página</option>
                        <option value="25">25 por página</option>
                        <option value="50">50 por página</option>
                    </select>
                    <div className="flex items-center">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                            className={`p-1 rounded ${currentPage === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span className="mx-2 text-sm">
                            Página {currentPage + 1} de {totalPages || 1}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages - 1}
                            className={`p-1 rounded ${currentPage >= totalPages - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;