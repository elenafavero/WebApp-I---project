import { useEffect, useState } from 'react';
import { getRandomCard, getThreeRandomCards,/* getRandomCardExcluding*/ } from './API/API';
import { Routes, Route, BrowserRouter, useNavigate } from 'react-router';
import ListCards from './components/ListCards';
import { Card } from '../../server/models/models.mjs';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const [tableCard, setTableCard] = useState(null); // carta sul tavolo

  const navigate = useNavigate();

  // Effettua la richiesta una sola volta al montaggio del componente

  useEffect(() => {
    getThreeRandomCards()  // Usa la funzione che restituisce 3 carte (array)
      .then(card => {
        setCards(card);    // Salva l'array di carte
        console.log("[APP] Cards:", card);
      })
      .catch(err => {
        setError(err.message || "Errore nel caricamento delle carte");
      });
  }, []);



  return (
    <Routes>
      <Route
        path="/api/round/start"
        element={
          <div className="container mt-4">
            <ListCards cards={cards} />
          </div>
        }
      />
    </Routes>
  );
}

export default App;