import { useState } from 'react';
import './requerimento.css';

function cadastraRequerimento() {
  const [formData, setFormData] = useState({
    finalidade: '',
    justificativa: '',
    files: []
  });
  const [isChecked, setIsChecked] = useState(false);
  const [fileList, setFileList] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFileList([...fileList, ...selectedFiles]);
  };

  const removeFile = (index) => {
    const updatedFiles = [...fileList];
    updatedFiles.splice(index, 1);
    setFileList(updatedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isChecked) {
      alert("Você precisa declarar que as informações são verdadeiras.");
      return;
    }

    try {
      // Create FormData object to send files
      const formDataToSend = new FormData();
      formDataToSend.append('finalidade', formData.finalidade);
      formDataToSend.append('justificativa', formData.justificativa);
      
      fileList.forEach((file, index) => {
        formDataToSend.append(`file${index}`, file);
      });

      // Send to backend
      const response = await fetch('http://localhost:8080/api/requerimentos', {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        alert('Requerimento enviado com sucesso!');
        // Reset form
        setFormData({
          finalidade: '',
          justificativa: ''
        });
        setFileList([]);
        setIsChecked(false);
      } else {
        alert('Erro ao enviar requerimento. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao enviar requerimento:', error);
      alert('Erro ao enviar requerimento. Por favor, tente novamente.');
    }
  };

  return (
    <div className="create-request-container">
      <div className="sidebar">
        <div className="logo">
          <img src="/logo.png" alt="Logo" />
        </div>
        <div className="user-info">
          <div className="avatar">
            <span>👤</span>
          </div>
          <div className="user-details">
            <p className="username">Aluno</p>
            <p className="email">aluno@ifsc.edu.br</p>
          </div>
        </div>
        <button className="exit-button">
          <span>↩ Sair</span>
        </button>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="finalidade">Finalidade do requerimento</label>
            <select 
              id="finalidade" 
              name="finalidade" 
              value={formData.finalidade}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Selecione uma finalidade</option>
              <option value="1">Solicitação de Matrícula</option>
              <option value="2">Aproveitamento de Estudos</option>
              <option value="3">Justificativa de Faltas</option>
              <option value="4">Trancamento de Matrícula</option>
              <option value="5">Validação de Disciplina</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="justificativa">Justificativa do requerimento</label>
            <textarea 
              id="justificativa" 
              name="justificativa" 
              rows="10" 
              value={formData.justificativa}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>

          <div className="form-group file-upload-section">
            <div className="file-upload-header">
              <h3>Anexo de arquivos</h3>
            </div>
            <div className="file-upload-info">
              <p>Dever ser disponibilizada a cópia de documentos originais, com assinatura e/ou carimbo ou outro documento comprobatório da instituição de origem, ou que seja possível a consulta e/ou certificação em meio digital.</p>
              <p>Faça upload de até 10 arquivos aceitos: PDF, document, image ou spreadsheet. O tamanho máximo é de 100 MB por item.</p>
            </div>
            <div className="file-upload-area">
              <label htmlFor="fileUpload" className="file-upload-button">
                <span>⬆️ Adicionar arquivo</span>
                <input 
                  type="file" 
                  id="fileUpload" 
                  multiple 
                  onChange={handleFileChange} 
                  hidden 
                />
              </label>
              {fileList.length > 0 && (
                <div className="file-list">
                  {fileList.map((file, index) => (
                    <div key={index} className="file-item">
                      <span>{file.name}</span>
                      <button 
                        type="button" 
                        onClick={() => removeFile(index)}
                        className="remove-file-btn"
                      >
                        ✖
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-container">
              <input 
                type="checkbox" 
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              <span>Declaro que as informações acima prestadas são verdadeiras e assumo a inteira responsabilidade pelas mesmas.</span>
            </label>
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-confirm">Confirmar</button>
            <button type="button" className="btn-cancel">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default cadastraRequerimento;