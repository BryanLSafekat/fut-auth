import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Navbar = () => {
  const [clientId, setClientId] = useState('');

  useEffect(() => {
    const fetchClientId = async () => {
      try {
        const response = await axios.get('http://localhost:8080/get-client-id');
        if (response.status === 200) {
          setClientId(response.data.clientId);
        } else {
          throw new Error('Error al obtener el ID de cliente');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchClientId();
  }, []);

  const handleLogin = () => {
    if (clientId) {
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=http://localhost:8080/callback&scope=openid%20profile%20email&access_type=offline`;
    } else {
      console.error('El ID de cliente aún no está disponible. Espere e intente nuevamente.');
    }
  };

  return (
    <nav>
      <div className="Navbar">
        <h1>Prueba</h1>
        <ul>
          <button onClick={handleLogin}>Login with Google</button>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
