import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { FaBuilding, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import CompanyForm from './CompanyForm';
import CompanyList from './CompanyList';
import { API_BASE_URL } from '../config'; // Importamos la URL base

// --- Definición de Tipos ---
interface Company {
  id: string;
  name: string;
}

interface DashboardStats {
  totalCompanies: number;
  pendingDocs: number;
  approvedDocs: number;
  rejectedDocs: number;
}

interface DocumentStatusData {
  name: string;
  value: number;
}

const AdminDashboard: React.FC = () => {
  // --- Estados del Componente ---
  const [stats, setStats] = useState<DashboardStats>({
    totalCompanies: 0,
    pendingDocs: 0,
    approvedDocs: 0,
    rejectedDocs: 0,
  });
  const [companies, setCompanies] = useState<Company[]>([]);

  // --- Funciones ---
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const fetchAllData = useCallback(async () => {
    try {
      // Pedimos los contadores a la URL en la nube
      const statsResponse = await fetch(`${API_BASE_URL}/getAdminDashboardData`);
      if (!statsResponse.ok) throw new Error('Error al obtener estadísticas');
      const statsData = await statsResponse.json();
      setStats({
        totalCompanies: statsData.companyCount,
        pendingDocs: statsData.pendingCount,
        approvedDocs: statsData.approvedCount,
        rejectedDocs: statsData.rejectedCount,
      });

      // Pedimos la lista de empresas a la URL en la nube
      const companiesResponse = await fetch(`${API_BASE_URL}/getCompanies`);
      if (!companiesResponse.ok) throw new Error('Error al obtener empresas');
      const companiesData = await companiesResponse.json();
      setCompanies(companiesData);

    } catch (error) {
      console.error("Error al conectar con el backend en vivo:", error);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // --- Datos para Gráficas y Tarjetas ---
  const chartData: DocumentStatusData[] = [
    { name: 'Pendientes', value: stats.pendingDocs },
    { name: 'Aprobados', value: stats.approvedDocs },
    { name: 'Rechazados', value: stats.rejectedDocs },
  ];

  const cards = [
    { icon: <FaBuilding size={32} color="#4F46E5" />, title: 'Total de Empresas', value: stats.totalCompanies },
    { icon: <FaClock size={32} color="#F59E42" />, title: 'Documentos Pendientes', value: stats.pendingDocs },
    { icon: <FaCheckCircle size={32} color="#22C55E" />, title: 'Documentos Aprobados', value: stats.approvedDocs },
    { icon: <FaTimesCircle size={32} color="#EF4444" />, title: 'Documentos Rechazados', value: stats.rejectedDocs },
  ];

  // --- Renderizado del Componente ---
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Administrativo</h1>
        <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
      </div>

      <CompanyForm onCompanyCreated={fetchAllData} />
      
      <CompanyList companies={companies} />

      <div className="dashboard-cards">
        {cards.map((card, idx) => (
          <div className="dashboard-card" key={idx}>
            <div className="card-icon">{card.icon}</div>
            <div className="card-title">{card.title}</div>
            <div className="card-value">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-chart">
        <h3>Estado de Documentos</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#6366F1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;