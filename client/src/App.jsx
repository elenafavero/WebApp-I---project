import { useEffect, useState } from 'react';
import { getRandomCard, getThreeRandomCards } from './API/API';
import { Routes, Route } from 'react-router-dom';
import ListCards from './components/ListCards';
import { Card } from '../../server/models/models.mjs';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [cards, setCards] = useState([]);
  const [cards_test, setCards_test] = useState([]);
  const [error, setError] = useState(null);

  // Effettua la richiesta una sola volta al montaggio del componente

  useEffect(() => {
    getThreeRandomCards()  // Usa la funzione che restituisce 3 carte (array)
      .then(card => {
        setCards(card);    // Salva l'array di carte
      })
      .catch(err => {
        setError(err.message || "Errore nel caricamento delle carte");
      });
  }, []);


  useEffect(() => {
    setCards_test([
      new Card("You slip on a wet hotel floor", "/images/stab.jpg", 1.0),
      new Card("Mosquitoes bite you all night", "/images/missed_flight.jpg", 2.5),
      new Card("The beach is closed for maintenance", "/images/broken_luggage.jpg", 4.0),
    ]);
  }, []);

  useEffect(() => {
    console.log("Cards fetched:", cards_test);
  }, [cards_test]);

  return (
    <>
      <Routes>
        <Route path="/api/cards/random/3" element={<ListCards cards={cards_test} />} />
      </Routes>
    </>
  );
}

export default App;