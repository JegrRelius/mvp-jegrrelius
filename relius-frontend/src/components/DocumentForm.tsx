import React, { useState } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { API_BASE_URL } from '../config';

interface DocumentFormProps {
  companyId: string;
  onDocumentCreated: () => void;
}

const DocumentForm: React.FC<DocumentFormProps> = ({ companyId, onDocumentCreated }) => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      setMessage('Por favor, selecciona un archivo.');
      return;
    }
    setLoading(true);
    setMessage(`Subiendo "${file.name}"...`);
    try {
      const storageRef = ref(storage, `documents/${companyId}/${Date.now()}_${file.name}`);
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadResult.ref);
      const response = await fetch(`${API_BASE_URL}/createDocumentTask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentName: file.name, companyId, downloadURL }),
      });
      if (!response.ok) {
        throw new Error('Falló el registro del documento en la base de datos');
      }
      setMessage(`¡Archivo "${file.name}" subido y registrado con éxito!`);
      setFile(null);
      onDocumentCreated();
    } catch (error) {
      console.error(error);
      setMessage('Error al subir el archivo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="document-form-container">
      <h4>Añadir Nuevo Documento</h4>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>
          {loading ? 'Subiendo...' : 'Añadir Documento'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default DocumentForm;