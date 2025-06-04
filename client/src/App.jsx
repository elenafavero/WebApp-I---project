import { useEffect, useState, useRef } from 'react';
import { getRandomCard, getThreeRandomCards, getRandomCardExcluding } from './API/API';
import { Routes, Route, BrowserRouter, useNavigate } from 'react-router';
import ListCards from './components/ListCards';
import { Card } from '../../server/models/models.mjs';
import Header from './components/Header'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const [tableCard, setTableCard] = useState(null); // carta sul tavolo
  const [round, setRound] = useState(-1);
  const [correctGuesses, setCorrectGuesses] = useState(0);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameOver, setGameOver] = useState(0); // 0 = in corso, 1 = vinto, -1 = perso
  const [lastGuessCorrect, setLastGuessCorrect] = useState(null); // true/false/null
  const [roundHistory, setRoundHistory] = useState([]);

  const navigate = useNavigate();
  const hasInitialized = useRef(false);

  // avvio del gioco
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    async function startGame() {
      try {
        const initialCards = await getThreeRandomCards();
        const excludeIds = initialCards.map(c => c.bad_luck_index);
        const newTableCard = await getRandomCardExcluding(excludeIds);

        setCards(initialCards.sort((a, b) => a.bad_luck_index - b.bad_luck_index));
        setTableCard(newTableCard);
        setError(null);
      } catch (err) {
        setError(err.message || 'Errore durante l’inizializzazione del gioco');
      }
    }

    startGame(); // esegui subito questa funzione asincrona" quando il componente si monta.

  }, []);

  function handleIntervalClick(startIndex, endIndex) {
    const startValue = cards[startIndex]?.bad_luck_index ?? -Infinity;
    const endValue = cards[endIndex]?.bad_luck_index ?? Infinity;
    const tableValue = tableCard.bad_luck_index;

    const inCorrectInterval = tableValue > startValue && tableValue < endValue;

    nextTurn(inCorrectInterval);
  }

  useEffect(() => {
    console.log("🟢 Round:", round);
    console.log("✅ Correct:", correctGuesses);
    console.log("❌ Wrong:", wrongGuesses);
    console.log("🕹️ Last Guess:", lastGuessCorrect);
    console.log("📜 History:", roundHistory);
    if (round >= 0)
      console.log("📜 card History:", roundHistory[round].card);
  }, [round, correctGuesses, wrongGuesses, lastGuessCorrect, roundHistory]);


  async function nextTurn(takeCard) {
    if (gameOver != 0) return;

    // Salviamo subito se la scelta è corretta, così il render userà il valore aggiornato
    setLastGuessCorrect(takeCard);


    // Salviamo il round history immediatamente
    setRoundHistory(prev => [
      ...prev,
      {
        round: round + 1,
        card: tableCard,
        result: takeCard ? 'won' : 'lost'
      }
    ]);

    // Aggiorniamo round
    setRound(prev => prev + 1);

    // Se scelta corretta
    if (takeCard) {
      const newCards = [...cards, tableCard];
      const sortedCards = newCards.sort((a, b) => a.bad_luck_index - b.bad_luck_index);
      setCards(sortedCards);

      setCorrectGuesses(prev => {
        const newCorrect = prev + 1;
        if (newCorrect === 3) {
          setGameOver(1); // Game Over: hai vinto
        }
        return newCorrect;
      });

      const excludeIds = sortedCards.map(c => c.id);
      const newCard = await getRandomCardExcluding(excludeIds);
      setTableCard(newCard);
    } else {
      // scelta errata: NON aggiungo la carta
      setWrongGuesses(prev => {
        const newWrong = prev + 1;
        if (newWrong >= 3) {
          setGameOver(-1); // Game Over: hai perso
        }
        return newWrong;
      });

      const excludeIds = cards.map(c => c.id).concat(tableCard.id);
      const newCard = await getRandomCardExcluding(excludeIds);
      setTableCard(newCard);
    }
  }

  if (error) return <div className="alert alert-danger mt-4">{error}</div>;


  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', width: '100vw' }}>
      <Routes>
        <Route
          path="/"
          element={<Header />}
        >
          {/* Home page: welcome and start game button */}
          <Route
            path="home"
            element = {
              <div className="container d-flex flex-column justify-content-center align-items-center" style={{ padding: '20px' }}>
                <h1 className="mb-4">Welcome to Stuff Happens!</h1>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/api/round/start')}
                >
                  Start New Game
                </button>
              </div>
            }
          />

          <Route
            path="api/round/start"
            // TODO: sposta tutta sta roba in un componente a parte
            element={
              <div className="container d-flex flex-column justify-content-center align-items-center" style={{ padding: '20px' }}>

                {tableCard && (
                  <div className="card" style={{ width: '12rem', height: '15rem' }}>
                    <img
                      src={tableCard.imageUrl}
                      className="card-img-top"
                      alt="Carta"
                      style={{ height: '55%', objectFit: 'cover' }}
                    />
                    <div className="card-body d-flex flex-column justify-content-between" style={{ padding: '0.4rem' }}>
                      <p className="card-text" style={{ fontSize: '0.80rem' }}>{tableCard.description}</p>
                      <p className="text-muted" style={{ fontSize: '0.80rem' }}>Bad Luck Index: {tableCard.bad_luck_index}</p>
                    </div>
                  </div>
                )}

                {/* QUI MOSTRI IL MESSAGGIO DI VITTORIA/SCONFITTA */}
                {gameOver === -1 && (
                  <div className="alert alert-danger mt-3" role="alert">
                    ❌ You lost!
                  </div>
                )}

                {gameOver === 1 && (
                  <div className="alert alert-success mt-3" role="alert">
                    🎉 You won!
                  </div>
                )}

                <div className="d-flex justify-content-center gap-3 mt-4" style={{ width: '100%' }}>
                  <ListCards cards={cards} onIntervalClick={handleIntervalClick} />
                </div>
              </div>
            }

          />
        </Route>

      </Routes>
    </div>
  );

}

export default App;