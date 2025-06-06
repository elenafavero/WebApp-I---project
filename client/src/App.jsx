import { useEffect, useState, useRef } from 'react';
import { getThreeRandomCards, getRandomCardExcluding } from './API/API';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router';
import ListCards from './components/ListCards';
import Welcome from './components/Welcome';
import NewCard from './components/NewCard';
import ShowResult from './components/Result';
import Profile from './components/Profile';
import Header from './components/Header'
import LoginForm from './components/LoginForm';
import StartPage from './components/StartPage';
import { logIn, logout } from './API/API';
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
  const [allGamesHistory, setAllGamesHistory] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null); // già usata nel login/logout
  const [demoRound, setDemoRound] = useState([]); // per il demo, non usata in questo momento

  const navigate = useNavigate();
  const location = useLocation();
  const hasInitialized = useRef(false);

  // avvio del gioco
 useEffect(() => {
  if (location.pathname !== '/api/round/start') return;

  // Solo per utenti loggati, esegui una volta sola
  if (loggedIn) {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
  }

  async function startGame() {
    try {
      const initialCards = await getThreeRandomCards();
      const excludeIds = initialCards.map(c => c.bad_luck_index);
      const newTableCard = await getRandomCardExcluding(excludeIds);

      setCards(initialCards.sort((a, b) => a.bad_luck_index - b.bad_luck_index));
      setTableCard(newTableCard);
      setError(null);
    } catch (err) {
      setError("Errore nel caricamento delle carte.");
    }
  }

  startGame();
}, [location.pathname, loggedIn]);


  const timerRef = useRef(null);


  // timer
  useEffect(() => {
    const isGameScreen = location.pathname === '/api/round/start';
    if (!isGameScreen || !tableCard || gameOver !== 0) return;

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
  }, [tableCard, gameOver, location.pathname]); // NOTA: location.pathname incluso qui



  useEffect(() => {
    if (timeLeft === 0 && gameOver === 0 && !waitForNextRound) {
      handleGuess(false, true);
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




  function handleGuess(takeCard, isTimeout = false) {
    if (gameOver !== 0 || waitForNextRound) return;

    // FERMA IL TIMER NON APPENA SI INSERISCE LA CARTA
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setLastGuessCorrect(takeCard ? true : (isTimeout ? 'timeout' : false));

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

    if (!loggedIn) {
      navigate('/');
      return;
    }

    setLastGuessCorrect(null);

    const excludeIds = cards.map(c => c.bad_luck_index).concat(tableCard.bad_luck_index);
    const newCard = await getRandomCardExcluding(excludeIds);

    setTableCard(newCard);
    setWaitForNextRound(false);
  }


  // ritardo di 2 secondi prima di navigare alla pagina dei risultati
  // serve mettere: location.pathname === '/api/round/start' 
  // -> altrimenti se dalla pagina /game/result vai a /profile, dopo 2 secondi ti avrebbe riportato di nuovo a /game/result
  useEffect(() => {
    if ((gameOver === -1 || gameOver === 1) && location.pathname === '/api/round/start') {
      const delay = setTimeout(() => {
        navigate('/game/result', { replace: true });
      }, 2000);

      return () => clearTimeout(delay);
    }
  }, [gameOver, navigate, location]);


  // Accumulare i dati di ogni game 
  useEffect(() => {
    if (gameOver !== 0 && loggedIn) {
      setAllGamesHistory(prev => [
        ...prev,
        {
          date: new Date(),
          rounds: roundHistory,
          correctGuesses,
          wrongGuesses,
          result: gameOver === 1 ? 'won' : 'lost',
        }
      ]);
    }
  }, [gameOver, loggedIn]);



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



  const handleLogin = async (credentials) => {
    try {
      const loginUser = await logIn(credentials);
      console.log(loginUser)
      setLoggedIn(true);
      setMessage({ msg: `Welcome, ${loginUser.name}!`, type: 'success' });
      setUser(loginUser);
    } catch (err) {
      setMessage({ msg: err, type: 'danger' })
    }

  }

  const handleLogout = async () => {
    try {
      await logout();
      setLoggedIn(false);
      setUser(null);
      setMessage({ msg: 'Logout effettuato con successo', type: 'success' });
      navigate('/');
    } catch (err) {
      setMessage({ msg: 'Errore durante il logout', type: 'danger' });
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#f4f7fa' }}>

      <Routes>
        <Route
          path="/"
          element={<Header loggedIn={loggedIn} handleLogout={handleLogout} />}
        >

          {/* Home page: welcome and choose version */}
          <Route index element={<Welcome />} />

          {/* Login */}
          <Route path="api/login" element={loggedIn ? <Navigate replace to='/api/start' /> : <LoginForm handleLogin={handleLogin} />} />

          {/* Start page (+ rules)  */}
          <Route path="api/start" element={<StartPage loggedIn={loggedIn} />} />

          {/* Game starts */}
          {/* TODO: cambia la route in start/round */}
          <Route
            path="api/round/start"
            element={
              <>
                <NewCard tableCard={tableCard} timeLeft={timeLeft} gameOver={gameOver} lastGuessCorrect={lastGuessCorrect} />
                <ListCards cards={cards} onIntervalClick={handleIntervalClick} waitForNextRound={waitForNextRound} proceedToNextRound={proceedToNextRound}
                  gameOver={gameOver} loggedIn={loggedIn} />
              </>
            }
          />

          {/* Game result (+ summary)*/}
          <Route
            path="game/result"
            element={<ShowResult gameOver={gameOver} resetGame={resetGame} />}
          />

          <Route
            path="profile"
            element={<Profile allGamesHistory={allGamesHistory} />}
          />




        </Route>

      </Routes>
    </div >
  );

}

export default App;