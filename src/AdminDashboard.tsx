import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { FaBuilding, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './AdminDashboard.css'; // Puedes crear este archivo para estilos personalizados

// Tipos para los datos del dashboard
interface DashboardStats {
  totalCompanies: number;
  pendingDocs: number;
  approvedDocs: number;
  rejectedDocs: number;
}

// Tipos para los datos del gráfico
interface DocumentStatusData {
  name: string;
  value: number;
}

const AdminDashboard: React.FC = () => {
  // Estado para las estadísticas principales
  const [stats] = useState<DashboardStats>({
    totalCompanies: 10,
    pendingDocs: 5,
    approvedDocs: 20,
    rejectedDocs: 2,
  });

  // Estado para los datos del gráfico de barras
  const [chartData] = useState<DocumentStatusData[]>([
    { name: 'Pendientes', value: stats.pendingDocs },
    { name: 'Aprobados', value: stats.approvedDocs },
    { name: 'Rechazados', value: stats.rejectedDocs },
  ]);

  // Configuración de las tarjetas
  const cards = [
    {
      icon: <FaBuilding size={32} color="#4F46E5" />, // Ícono de empresa
      title: 'Total de Empresas',
      value: stats.totalCompanies,
    },
    {
      icon: <FaClock size={32} color="#F59E42" />, // Ícono de pendientes
      title: 'Documentos Pendientes',
      value: stats.pendingDocs,
    },
    {
      icon: <FaCheckCircle size={32} color="#22C55E" />, // Ícono de aprobados
      title: 'Documentos Aprobados',
      value: stats.approvedDocs,
    },
    {
      icon: <FaTimesCircle size={32} color="#EF4444" />, // Ícono de rechazados
      title: 'Documentos Rechazados',
      value: stats.rejectedDocs,
    },
  ];

  return (
    <div className="admin-dashboard">
      {/* Tarjetas de estadísticas principales */}
      <div className="dashboard-cards">
        {cards.map((card, idx) => (
          <div className="dashboard-card" key={idx}>
            <div className="card-icon">{card.icon}</div>
            <div className="card-title">{card.title}</div>
            <div className="card-value">{card.value}</div>
          </div>
        ))}
      </div>

      {/* Gráfico de barras para estados de documentos */}
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

/*
Notas de estilos sugeridos (AdminDashboard.css):
.admin-dashboard {
  max-width: 700px;
  margin: 0 auto;
  padding: 1.5rem;
}
.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}
.dashboard-card {
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.card-icon {
  margin-bottom: 0.5rem;
}
.card-title {
  font-size: 1rem;
  color: #6B7280;
  margin-bottom: 0.25rem;
}
.card-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #111827;
}
@media (max-width: 600px) {
  .dashboard-cards {
    grid-template-columns: 1fr 1fr;
  }
}
.dashboard-chart {
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 1rem;
}
*/
