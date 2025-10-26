import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li><Link to="/dashboard">Dashboard (Inicio)</Link></li>
          <li><Link to="/documentos-cargar">Documentos a Cargar</Link></li>
          <li><Link to="/cadena-suministro">Cadena de Suministro</Link></li>
          <li><Link to="/configuracion">Configuración de Documentos</Link></li>
          <li><Link to="/recopilacion">Recopilación de Documentos</Link></li>
          <li><Link to="/mi-cuenta">Información de Cuenta</Link></li>
          <li><Link to="/asesoria">Agendar Asesoría</Link></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;