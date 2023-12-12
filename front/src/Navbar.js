import React, { useState, useEffect } from "react";
import axios from "axios";

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/userData");

        setUserName(response.data.userName);
        setLoggedIn(true);
      } catch (error) {
        setLoggedIn(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogin = () => {
    const authUrl = "http://localhost:8080/auth/google";

    const width = 500;
    const height = 600;

    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    window.open(
      authUrl,
      "Google Login",
      `width=${width}, height=${height}, left=${left}, top=${top}`
    );
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/logout");
      setLoggedIn(false);
      setUserName("");
      window.location.href = "/";
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <nav>
      <div className="Navbar">
        <h1>Prueba</h1>
        <ul>
          {loggedIn ? (
            <>
              <li>{userName}</li>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <button onClick={handleLogin}>Login</button>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
