import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import DocumentForm from './DocumentForm';
import { API_BASE_URL } from '../config';

// --- Interfaces ---
interface Template {
  id: string;
  name: string;
  isRequiredMonthly: boolean;
}
interface Document {
  id: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  downloadURL?: string;
  rejectionReason?: string; // Añadimos el campo para la razón de rechazo
}
interface CompanyDetailsData {
  id: string;
  name: string;
  documents: Document[];
}

const CompanyDetails: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const [company, setCompany] = useState<CompanyDetailsData | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadingAction, setLoadingAction] = useState<string | null>(null); // Estado para los botones

  const fetchAllDetails = useCallback(async () => {
    // ... (Esta función no cambia)
    if (!companyId) return;
    try {
      setLoading(true);
      const companyRes = await fetch(`${API_BASE_URL}/getCompanyDetails?id=${companyId}`);
      const companyData = await companyRes.json();
      setCompany(companyData);
      const templatesRes = await fetch(`${API_BASE_URL}/getDocumentTemplates`);
      const templatesData = await templatesRes.json();
      setTemplates(templatesData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos.');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchAllDetails();
  }, [fetchAllDetails]);
  
  // --- LÓGICA DE APROBAR Y RECHAZAR ---
  const handleApprove = async (documentId: string) => {
    setLoadingAction(documentId);
    try {
      await fetch(`${API_BASE_URL}/approveDocument`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: documentId }),
      });
      await fetchAllDetails(); // Recargamos para ver el cambio
    } catch (err) {
      console.error("Error al aprobar:", err);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReject = async (documentId: string) => {
    // 1. Pedimos la razón del rechazo al usuario
    const reason = window.prompt("Por favor, introduce la razón del rechazo:");
    
    // 2. Si el usuario cancela o no escribe nada, no hacemos nada
    if (!reason || reason.trim() === '') {
      return; 
    }

    setLoadingAction(documentId);
    try {
      await fetch(`${API_BASE_URL}/rejectDocument`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: documentId, rejectionReason: reason }),
      });
      await fetchAllDetails(); // Recargamos para ver el cambio
    } catch (err) {
      console.error("Error al rechazar:", err);
    } finally {
      setLoadingAction(null);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="company-details-container">
      <h2>{company?.name}</h2>
      
      <h3>Checklist de Documentos del Mes</h3>
      <table className="documents-table">
        <thead>
          <tr>
            <th>Requisito</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {templates.map((template) => {
            const uploadedDoc = company?.documents.find(doc => doc.name.includes(template.name));
            
            return (
              <tr key={template.id}>
                <td>{template.name}</td>
                <td>
                  {uploadedDoc ? uploadedDoc.status : 'Faltante'}
                  {/* Si está rechazado, mostramos la razón */}
                  {uploadedDoc?.status === 'rejected' && (
                    <span className="rejection-reason"> - Razón: {uploadedDoc.rejectionReason}</span>
                  )}
                </td>
                <td>
                  {uploadedDoc ? (
                    <>
                      <a href={uploadedDoc.downloadURL} target="_blank" rel="noopener noreferrer">Ver Archivo</a>
                      {/* Solo mostramos los botones si el documento está pendiente */}
                      {uploadedDoc.status === 'pending' && (
                        <>
                          <button onClick={() => handleApprove(uploadedDoc.id)} disabled={!!loadingAction}>Aprobar</button>
                          <button onClick={() => handleReject(uploadedDoc.id)} disabled={!!loadingAction}>Rechazar</button>
                        </>
                      )}
                    </>
                  ) : (
                    template.isRequiredMonthly ?
                    <DocumentForm companyId={companyId!} onDocumentCreated={fetchAllDetails} />
                    : <span>No Requerido</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyDetails;