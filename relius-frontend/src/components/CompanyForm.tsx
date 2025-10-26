import React, { useState } from 'react';
import { API_BASE_URL } from '../config'; // Importamos la URL base

interface CompanyFormProps {
  onCompanyCreated: () => void;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ onCompanyCreated }) => {
  const [companyName, setCompanyName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');

    if (!companyName.trim()) {
      setMessage('El nombre de la empresa no puede estar vacío.');
      return;
    }

    try {
      // Usamos la URL base para la petición
      const response = await fetch(`${API_BASE_URL}/createCompany`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: companyName }),
      });

      if (!response.ok) {
        throw new Error('Falló la creación de la empresa');
      }

      // Ya no necesitamos la variable 'result'
      await response.json(); 
      setMessage(`¡Empresa "${companyName}" creada con éxito!`);
      setCompanyName('');
      onCompanyCreated();
    } catch (error) {
      console.error('Error al crear la empresa:', error);
      setMessage('Error al crear la empresa.');
    }
  };

  return (
    <div className="company-form-container">
      <h3>Crear Nueva Empresa</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Nombre de la Empresa"
        />
        <button type="submit">Crear Empresa</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CompanyForm;