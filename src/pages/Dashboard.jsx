import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Filter, FileText, Eye, Edit, Trash } from 'lucide-react';
import { fetchRequirements } from '../services/api';

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
    const [requirements, setRequirements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        const getRequirements = async () => {
            try {
                const data = await fetchRequirements();
                setRequirements(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        getRequirements();
    }, []);

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

    if (loading) {
        return <div className="p-6 flex justify-center">Carregando requerimentos...</div>;
    }
    
    return (
        <div className="p-6">
            <div className="flex justify-between mb-4">
                <Link
                    to="/new-requirement"
                    className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
                >
                    Novo requerimento
                </Link>

                <div className="flex items-center">
                    <div className="relative">
                        <input
                            type="text"
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary w-64"
                            placeholder="Termo de pesquisa"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Filter size={18} className="text-gray-400" />
                        </div>
                    </div>
                    <select
                        className="border border-gray-300 rounded-r-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary border-l-0"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">Todas as situações</option>
                        <option value="DEFERIDO">Deferido</option>
                        <option value="PENDENTE">Pendente</option>
                        <option value="INDEFERIDO">Indeferido</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-md shadow">
                {filteredRequirements.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        {error ? `Erro ao carregar requerimentos: ${error}` : 'Nenhum requerimento encontrado'}
                    </div>
                ) : (
                    filteredRequirements.map((req) => (
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
                                    <Link to={`/edit-requirement/${req.id}`} className="text-gray-500 hover:text-primary">
                                        <Edit size={20} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;