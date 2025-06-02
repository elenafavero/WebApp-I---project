import { useEffect, useState } from 'react';
import { getThreeRandomCards } from './API/API';
import './App.css';

function App() {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);

  // Effettua la richiesta una sola volta al montaggio del componente
  useEffect(() => {
    getThreeRandomCards()
      .then(setCards)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <h1>CIAOOO</h1>
      {error && <p style={{ color: 'red' }}>Errore: {error}</p>}
      <div className="cards-container">
        {cards.map((card, index) => (
          <div key={index} className="card">
            <img src={card.imageUrl} alt="card" />
            <p>{card.description}</p>
            <p>Indice sfiga: {card.bad_luck_index}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;