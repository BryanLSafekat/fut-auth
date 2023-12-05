import React, { useState, useEffect } from "react";
import "./App.css"
import axios from "axios";
import Navbar from "./Navbar";

function App() {
  const [futbolistas, setFutbolistas] = useState([]);

  useEffect(() => {
    const fetchFutbolistas = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/futbolistas");
        setFutbolistas(response.data);
      } catch (error) {
        console.log("Error al obtener los datos de la API: ", error);
      }
    };
    fetchFutbolistas();
  }, []);

  const handleVote = async (id) => {
    try {
      const updatedFutbolistas = futbolistas.map((futbolista) =>
        futbolista.id === id ? { ...futbolista, votes: futbolista.votes + 1 } : futbolista
      );

      setFutbolistas(updatedFutbolistas);

      const votes = updatedFutbolistas.find((futbolista) => futbolista.id === id)?.votes || 0;


      await axios.put(`http://localhost:8080/api/futbolistas/${id}/votes`, {
        votes: votes 
      });
    } catch (error) {
      console.log("Error al votar: ", error);
    }
  };

  return (
    <>
      <div>
        <Navbar />
      </div>

      <h1>Futbolistas</h1>

      <ul>
        {futbolistas.map((futbolista) => (
          <li key={futbolista.id}>
            {futbolista.id} - {futbolista.name} - Votos: {futbolista.votes}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <button onClick={() => handleVote(futbolista.id)}>Votar</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
