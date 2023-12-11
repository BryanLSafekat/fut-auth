import React from "react";
import axios from "axios";

const Navbar = () => {
  const handleLogin = async () => {
    try {
      const response = await axios.get("http://localhost:8080/auth/google");

      window.location.href = response.data.authUrl;
    } catch (error) {
      console.error("Error al iniciar sesion", error);    
    }
  }

  return (
    <nav>
      <div className="Navbar">
        <h1>Prueba</h1>
        <ul>
          <button onClick={handleLogin}>Login</button>
          &nbsp;&nbsp;
          <button>Logout</button>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
