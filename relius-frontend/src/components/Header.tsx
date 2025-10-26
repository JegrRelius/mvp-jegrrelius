import React from 'react';
import { auth } from '../firebase'; // Importamos auth
import { signOut } from 'firebase/auth'; // Importamos signOut

const Header: React.FC = () => {
  // Función para cerrar sesión (la misma que teníamos antes)
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <header className="header">
      <div className="header-logo">Logo RELIUS</div>
      <div className="header-client-logo">Logo Cliente</div>
      {/* Reemplazamos el placeholder con el botón real */}
      <div className="header-user-menu">
        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
};

export default Header;