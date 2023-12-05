import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";

function App() {
  const [futbolistas, setfutbolistas] = useState([]);

  useEffect(() => {
    const futbolista = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/futbolistas"
        );
        setfutbolistas(response.data);
      } catch (error) {
        console.log("Error al obtener los datos de la API: ", error);
      }
    };
    futbolista();
  }, []);

  return (
    <>
      <div>
        <Navbar />
      </div>

      <h1>Futbolistas</h1>

      <ul>
        {futbolistas.map((futbolista) => (
          <li key={futbolista.id}>
            {futbolista.id} - {futbolista.name}
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
