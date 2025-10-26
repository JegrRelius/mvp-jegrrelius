import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import CompanyDetails from './components/CompanyDetails';
import Layout from './components/Layout'; // Importamos el Layout
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import './App.css';

// Componente protector para envolver nuestras rutas seguras
const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }
  
  // Si hay usuario, muestra el contenido dentro del Layout. Si no, redirige a login.
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Rutas Protegidas */}
        <Route path="/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/empresa/:companyId" element={<PrivateRoute><CompanyDetails /></PrivateRoute>} />
        
        {/* Añadimos placeholders para las nuevas rutas */}
        <Route path="/documentos-cargar" element={<PrivateRoute><h1>Documentos a Cargar</h1></PrivateRoute>} />
        <Route path="/cadena-suministro" element={<PrivateRoute><h1>Cadena de Suministro</h1></PrivateRoute>} />
        <Route path="/configuracion" element={<PrivateRoute><h1>Configuración</h1></PrivateRoute>} />
        {/* ... etc para las otras rutas ... */}
        
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;