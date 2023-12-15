import React, { useState, useEffect } from "react";
import axios from "axios";

const Navbar = () => {
  const [clientId, setClientId] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });

  useEffect(() => {
    const fetchClientId = async () => {
      try {
        const response = await axios.get("http://localhost:8080/get-client-id");
        if (response.status === 200 && response.data.clientId) {
          setClientId(response.data.clientId);
        } else {
          throw new Error("Error al obtener el ID de cliente");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchClientId();
  }, []);

  useEffect(() => {
    const handleCode = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        try {
          const response = await axios.get(
            `http://localhost:8080/get-user-info?code=${code}`
          );
          if (response.status === 200) {
            const { name, email } = response.data;
            setUserInfo({ name, email });
            setIsLoggedIn(true);

            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userInfo", JSON.stringify({ name, email }));

            window.location.href = "http://localhost:3000";
          } else {
            throw new Error("Error al obtener información del usuario");
          }
        } catch (error) {
          console.error(error);
          setIsLoggedIn(false);
        }
      }
    };

    handleCode();
  }, []);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn === "true") {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        const { name, email } = JSON.parse(userInfo);
        setUserInfo({ name, email });
        setIsLoggedIn(true);
      }
    }
  }, []);

  const handleLogin = () => {
    if (clientId) {
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=http://localhost:8080/callback&scope=openid%20profile%20email&access_type=offline`;
    } else {
      console.error(
        "El ID de cliente aún no está disponible. Espere e intente nuevamente."
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userInfo");
    setIsLoggedIn(false);
    setUserInfo({ name: "", email: "" });
    window.location.href = "http://localhost:3000";
  };

  return (
    <nav>
      <div className="Navbar">
        <h1>Prueba</h1>
        <ul>
          {isLoggedIn ? (
            <>
              <li>{userInfo.name}</li>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <button onClick={handleLogin}>Login with Google</button>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
