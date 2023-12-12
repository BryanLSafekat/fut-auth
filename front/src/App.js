import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import Navbar from "./Navbar";

function App() {
  const [futbolistas, setFutbolistas] = useState([]);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    const fetchFutbolistas = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/futbolistas"
        );
        setFutbolistas(response.data);
      } catch (error) {
        console.log("Error al obtener los datos de la API: ", error);
      }
    };
    fetchFutbolistas();
  }, []);

  const handleVote = async (id) => {
    try {
      if (!voted) {
        const response = await axios.get(
          `http://localhost:8080/api/futbolistas/${id}`
        );
        const currentVotes = response.data.votes || 0;

        const updatedFutbolistas = futbolistas.map((futbolista) =>
          futbolista.id === id
            ? { ...futbolista, votes: futbolista.votes + 1 }
            : futbolista
        );

        setFutbolistas(updatedFutbolistas);
        setVoted(true);

        await axios.put(`http://localhost:8080/api/futbolistas/${id}/votes`, {
          votes: currentVotes + 1,
        });
      }
    } catch (error) {
      console.log("Error al votar: ", error);
    }
  };

  return (
    <>
      <div>
        <Navbar />
      </div>

      <h2>Futbolistas</h2>

      <ul>
        {futbolistas.map((futbolista) => (
          <li key={futbolista.id}>
            {futbolista.id} - {futbolista.name} - Votos: {futbolista.votes}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <button onClick={() => handleVote(futbolista.id)} disabled={voted}>
              Votar
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
