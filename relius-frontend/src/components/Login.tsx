import React, { useState } from 'react';
import { auth } from '../firebase'; 
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault(); 
    setError(''); 

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('>>> LOGIN EXITOSO en Login.tsx'); // <--- BALIZA 3
      // No necesitamos hacer nada más aquí, PrivateRoute se encargará
    } catch (err) {
      console.error("Error en el inicio de sesión:", err);
      setError('Error: Revisa tu correo y contraseña.');
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        {/* ... El resto del formulario no cambia ... */}
         <div className="form-group">
           <label>Correo Electrónico</label>
           <input
             type="email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             required
           />
         </div>
         <div className="form-group">
           <label>Contraseña</label>
           <input
             type="password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             required
           />
         </div>
         {error && <p className="error-message">{error}</p>}
         <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};

export default Login;