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
  const [waitForNextRound, setWaitForNextRound] = useState(false);

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
        console.log("[APP] Initial Cards:", excludeIds);
        const newTableCard = await getRandomCardExcluding(excludeIds);
        console.log("[APP] New Table Card:", newTableCard);

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
    if (timeLeft === 0 && gameOver === 0 && !waitForNextRound) {
      handleGuess(false);
    }
  }, [timeLeft, gameOver]);


  // return: true if the choosen interval is correct, false otherwise
  function handleIntervalClick(startIndex, endIndex) {
    const startValue = cards[startIndex]?.bad_luck_index ?? -Infinity;
    const endValue = cards[endIndex]?.bad_luck_index ?? Infinity;
    const tableValue = tableCard.bad_luck_index;

    const inCorrectInterval = tableValue > startValue && tableValue < endValue;

    handleGuess(inCorrectInterval);
  }

  // stampe
  useEffect(() => {
    console.log("🟢 Round:", round);
    console.log("✅ Correct:", correctGuesses);
    console.log("❌ Wrong:", wrongGuesses);
    console.log("🕹️ Last Guess:", lastGuessCorrect);
    console.log("📜 History:", roundHistory);
    if (round >= 0)
      console.log("📜 card History:", roundHistory[round].card);
  }, [round, correctGuesses, wrongGuesses, lastGuessCorrect, roundHistory]);



  function handleGuess(takeCard) {
    if (gameOver !== 0 || waitForNextRound) return;

    // FERMA IL TIMER NON APPENA SI INSERISCE LA CARTA
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setLastGuessCorrect(takeCard);

    // aggiungi la carta alla storia del game
    setRoundHistory(prev => [
      ...prev,
      {
        round: round + 1,
        card: tableCard,
        result: takeCard ? 'won' : 'lost'
      }
    ]);

    setRound(prev => prev + 1);

    if (takeCard) {
      const newCards = [...cards, tableCard];
      const sortedCards = newCards.sort((a, b) => a.bad_luck_index - b.bad_luck_index);
      setCards(sortedCards);

      setCorrectGuesses(prev => {
        const newCorrect = prev + 1;
        if (newCorrect === 3) {
          setGameOver(1); // Hai vinto
        }
        return newCorrect;
      });
    } else {
      setWrongGuesses(prev => {
        const newWrong = prev + 1;
        if (newWrong >= 3) {
          setGameOver(-1); // Hai perso
        }
        return newWrong;
      });
    }

    setWaitForNextRound(true); // aspetta il click prima di continuare
  }


  async function proceedToNextRound() {
    if (gameOver !== 0) return;

    const excludeIds = cards.map(c => c.bad_luck_index).concat(tableCard.bad_luck_index);
    const newCard = await getRandomCardExcluding(excludeIds);

    setTableCard(newCard);
    setWaitForNextRound(false);
  }


  // ritardo di 2 secondi prima di navigare alla pagina dei risultati
  useEffect(() => {
    if (gameOver === -1 || gameOver === 1) {
      const delay = setTimeout(() => {
        navigate('/game/result');
      }, 2000);

      return () => clearTimeout(delay);
    }
  }, [gameOver, navigate]);

  if (error) return <div className="alert alert-danger mt-4">{error}</div>;


  // Reset del gioco dopo ogni game concluso
  const resetGame = async () => {
    setCards([]);
    setTableCard(null);
    setRound(-1);
    setCorrectGuesses(0);
    setWrongGuesses(0);
    setGameOver(0);
    setLastGuessCorrect(null);
    setRoundHistory([]);
    setWaitForNextRound(false);
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
          element={<Header />}
        >

          {/* Home page: welcome and start game button */}
          <Route index element={<Welcome />} />


          <Route
            path="api/round/start"
            element={
              <>
                <NewCard tableCard={tableCard} timeLeft={timeLeft} gameOver={gameOver} />
                <ListCards cards={cards} onIntervalClick={handleIntervalClick} waitForNextRound={waitForNextRound} proceedToNextRound={proceedToNextRound}
                  gameOver={gameOver} />
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