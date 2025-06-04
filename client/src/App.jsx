import { useEffect, useState, useRef } from 'react';
import { getRandomCard, getThreeRandomCards, getRandomCardExcluding } from './API/API';
import { Routes, Route, BrowserRouter, useNavigate } from 'react-router';
import ListCards from './components/ListCards';
import Welcome from './components/Welcome';
import NewCard from './components/NewCard';
import ShowResult from './components/ShowResult';
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
  const [timeLeft, setTimeLeft] = useState(30);

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

  const timerRef = useRef(null);


  // timer
  useEffect(() => {
    if (!tableCard || gameOver !== 0) return;

    setTimeLeft(30);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [tableCard, gameOver]);

  useEffect(() => {
    if (timeLeft === 0 && gameOver === 0) {
      nextTurn(false); // eseguito fuori dal setState
    }
  }, [timeLeft, gameOver]);

  useEffect(() => {
    console.log("⏱️ Tempo aggiornato:", timeLeft);
  }, [timeLeft]);



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

  useEffect(() => {
    if (gameOver === -1 || gameOver === 1) {
      navigate('/game/result');
    }
  }, [gameOver, navigate]);

  if (error) return <div className="alert alert-danger mt-4">{error}</div>;


  const resetGame = async () => {
    setCards([]);
    setTableCard(null);
    setRound(-1);
    setCorrectGuesses(0);
    setWrongGuesses(0);
    setGameOver(0);
    setLastGuessCorrect(null);
    setRoundHistory([]);
    hasInitialized.current = false; // Resetta l'inizializzazione

    const initialCards = await getThreeRandomCards();
    const excludeIds = initialCards.map(c => c.bad_luck_index);
    const newTableCard = await getRandomCardExcluding(excludeIds);

    setCards(initialCards.sort((a, b) => a.bad_luck_index - b.bad_luck_index));
    setTableCard(newTableCard);
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', width: '100vw' }}>

      <Routes>
        <Route
          path="/"
          element={

            <Header timeLeft={timeLeft} gameOver={gameOver} tableCard={tableCard} />

          }
        >

          {/* Home page: welcome and start game button */}
          <Route index element={<Welcome />} />

          <Route
            path="api/round/start"
            element={
              <>
                <NewCard tableCard={tableCard} />
                <ListCards cards={cards} onIntervalClick={handleIntervalClick} />
              </>
            }
          />

          <Route
            path="game/result"
            element={<ShowResult gameOver={gameOver} resetGame={resetGame} />}
          />



        </Route>

      </Routes>
    </div >
  );

}

export default App;