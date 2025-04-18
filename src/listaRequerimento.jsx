import { useState, useEffect } from 'react';
import './index.css';

function listaRequerimento() {
  const [searchText, setSearchText] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchRequests = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/requerimentos');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setRequests(data);
        setLoading(false);
      } catch (error) {
        
        if (error.response) {
          console.error('Error response:', {
            status: error.response.status,
            statusText: error.response.statusText,
            data: await error.response.text().catch(() => 'Failed to parse response text')
          });
        }
        
        setError('Failed to load requests. Please try again later.');
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const filteredRequests = requests.filter(request =>
    request.nomeUsuario.toLowerCase().includes(searchText.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'green';
      case 'PENDING':
        return 'yellow';
      case 'REJECTED':
        return 'red';
      default:
        return 'gray';
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="request-page">
      <header className="header">
        <div className="logo">
          <img src="/logo.png" alt="Logo" className="logo-image" />
        </div>
        <h1>Novo requerimento</h1>
      </header>

      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Nome do discente"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="search-input"
          />
          <button className="search-clear" onClick={() => setSearchText('')}>×</button>
        </div>
        <div className="dropdown">
          <button className="dropdown-button">
            Situação
            <span className="dropdown-arrow">▼</span>
          </button>
        </div>
      </div>

      <div className="requests-list">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <div className="request-item" key={request.id}>
              <div className="request-info">
                <h2 className="student-name">{request.nomeUsuario}</h2>
                <p className="course-info">{request.nomeCurso}</p>
                <p className="reason-info">{request.finalidade}</p>
              </div>
              <div className="request-actions">
                <span 
                  className={`status-badge ${getStatusColor(request.situacao)}`}
                >
                  Situação
                </span>
                <div className="action-buttons">
                  <button className="action-button view">
                    <i className="icon-doc"></i>
                  </button>
                  <button className="action-button edit">
                    <i className="icon-edit"></i>
                  </button>
                  <button className="action-button preview">
                    <i className="icon-eye"></i>
                  </button>
                  <button className="action-button delete">
                    <i className="icon-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-requests">No requests found</div>
        )}
      </div>

      <footer className="footer">
        <button className="exit-button">
          <i className="icon-exit"></i>
          Sair
        </button>
      </footer>
    </div>
  );
}

export default listaRequerimento;