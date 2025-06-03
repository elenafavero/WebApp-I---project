import { useEffect, useState, useRef } from 'react';
import { getRandomCard, getThreeRandomCards, getRandomCardExcluding } from './API/API';
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
  const hasInitialized = useRef(false);

  // avvio del gioco
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    async function startGame() {
      try {
        const initialCards = await getThreeRandomCards();
        console.log("[App] Initial cards:", initialCards);
        const excludeIds = initialCards.map(c => c.bad_luck_index);
        const newTableCard = await getRandomCardExcluding(excludeIds);
        console.log("[App] New table card:", newTableCard);

        setCards(initialCards);
        setTableCard(newTableCard);
        setError(null);
      } catch (err) {
        setError(err.message || 'Errore durante l’inizializzazione del gioco');
      }
    }

    startGame(); // esegui subito questa funzione asincrona" quando il componente si monta.

  }, []);


  // Funzione che gestisce la scelta della carta sul tavolo
  async function nextTurn(takeCard) {
    try {
      const updatedCards = takeCard ? [...cards, tableCard] : [...cards];
      setCards(updatedCards);

      const excludeIds = updatedCards.map(c => c.id);
      const newCard = await getRandomCardExcluding(excludeIds);
      setTableCard(newCard);
    } catch (err) {
      setError(err.message || 'Errore nel turno');
    }
  }

  if (error) return <div className="alert alert-danger mt-4">{error}</div>;


  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', width: '100vw' }}>
      <Routes>
        <Route
          path="/api/round/start"
          element={
            <div className="container d-flex flex-column justify-content-center align-items-center" style={{ padding: '20px' }}>
              {/* Carta nuova sopra */}
              {tableCard && (
                <div className="card" style={{ width: '15rem', height: '22rem' }}>
                  <img
                    src={tableCard.imageUrl}
                    className="card-img-top"
                    alt="Carta"
                    style={{ height: '70%', objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column justify-content-between">
                    <p className="card-text">{tableCard.description}</p>
                    <p className="text-muted">Indice Sfortuna: {tableCard.bad_luck_index}</p>
                  </div>
                </div>
              )}

              {/* Tre carte sotto, centrali */}
              <div className="d-flex justify-content-center gap-3 mt-4" style={{ width: '100%' }}>
                <ListCards cards={cards} />
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );

}

export default App;