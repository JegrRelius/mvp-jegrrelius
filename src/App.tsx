import { useState, useEffect } from 'react'; // Eliminamos React
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import CompanyDetails from './components/CompanyDetails';
import Layout from './components/Layout';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import './App.css';

// Componente protector
const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('>>> ESTADO DE AUTH CAMBIÓ en PrivateRoute:', currentUser); // <--- BALIZA 1
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }
  
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

function App() {
  // Ya no necesitamos el estado user/loading aquí, se movió a PrivateRoute
  console.log('>>> RENDERIZANDO App.tsx'); // <--- BALIZA 2 (Solo para ver que App carga)

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} /> 
        
        {/* Rutas Protegidas */}
        <Route path="/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/empresa/:companyId" element={<PrivateRoute><CompanyDetails /></PrivateRoute>} />
        <Route path="/documentos-cargar" element={<PrivateRoute><h1>Documentos a Cargar</h1></PrivateRoute>} />
        {/* ... otras rutas ... */}
        
        <Route path="/" element={<Navigate to="/dashboard" />} /> 
      </Routes>
    </Router>
  );
}

export default App;