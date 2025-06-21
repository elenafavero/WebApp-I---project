import { useEffect, useState, useRef } from 'react';
import { fetchThreeRandomCards, fetchRandomCardExcluding, saveGameToDB, validateInterval } from './API/API';
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

const LOWER_BOUND = -1;
const UPPER_BOUND = 101;

function App() {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const [tableCard, setTableCard] = useState(null);                    // new card to guess
  const [round, setRound] = useState(-1);
  const [correctGuesses, setCorrectGuesses] = useState(0);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameOver, setGameOver] = useState(0);                         // 0 = in progress, 1 = won, -1 = lost
  const [lastGuessCorrect, setLastGuessCorrect] = useState(null);      // true/false/null
  const [roundHistory, setRoundHistory] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [waitForNextRound, setWaitForNextRound] = useState(false);     // true if the round is the round is finished and the user has to click to continue
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);                        // Message for Login, Logout and Welcome
  const [loading, setLoading] = useState(false);                       // Used for Loading Spinner
  const [showMessage, setShowMessage] = useState(false);               // Used to show/hide the message with fade out effect


  const navigate = useNavigate();
  const location = useLocation();
  const hasInitialized = useRef(false);


  // game start
  useEffect(() => {
    if (location.pathname !== '/game') return;

    // for logged user, do it just for the first round
    if (loggedIn) {
      if (hasInitialized.current) return;
      hasInitialized.current = true;
    }

    async function startGame() {
      try {
        setLoading(true);
        const initialCards = await fetchThreeRandomCards();
        const excludeIds = initialCards.map(c => c.bad_luck_index);
        const newTableCard = await fetchRandomCardExcluding(excludeIds);

        setCards(initialCards.sort((a, b) => a.bad_luck_index - b.bad_luck_index));
        setTableCard(newTableCard);
        setRoundHistory(
          initialCards.map((card) => ({
            round: -1,
            card: card,
            result: -1
          }))
        );
        setError(null);
      } catch (err) {
        setError("Error fetching initial cards: " + err.message);
      } finally {
        setLoading(false);
      }
    }


    startGame();
  }, [location.pathname, loggedIn]);


  const timerRef = useRef(null);


  // timer
  useEffect(() => {
    const isGamePage = location.pathname === '/game';
    if (!isGamePage || !tableCard || gameOver !== 0) return;

    setTimeLeft(30);

    if (timerRef.current)
      clearInterval(timerRef.current);

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
  }, [tableCard, gameOver, location.pathname]);



  useEffect(() => {
    if (timeLeft === 0 && gameOver === 0 && !waitForNextRound) {
      handleGuess(false, true);
    }
  }, [timeLeft, gameOver]);


  // return: true if the choosen interval is correct, false otherwise
  async function handleIntervalClick(startIndex, endIndex) {
    try {
      const isCorrect = await validateInterval(
        cards[startIndex]?.bad_luck_index ?? LOWER_BOUND,
        cards[endIndex]?.bad_luck_index ?? UPPER_BOUND,
        tableCard.bad_luck_index
      );

      handleGuess(isCorrect);
    } catch (err) {
      setError("Error while checking the card position: " + err.message);
    }
  }



  // isTimeOut: true if the user has not clicked on the card in time
  function handleGuess(takeCard, isTimeout = false) {
    if (gameOver !== 0 || waitForNextRound) return;

    // stop the timer as soon as the card is put in an interval
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setLastGuessCorrect(takeCard ? true : (isTimeout ? 'timeout' : false));

    if (takeCard) {
      const newCards = [...cards, tableCard];
      const sortedCards = newCards.sort((a, b) => a.bad_luck_index - b.bad_luck_index);
      setCards(sortedCards);

      setCorrectGuesses(prev => {
        const newCorrect = prev + 1;
        if (newCorrect === 3 || !loggedIn) {
          setGameOver(1); // you win
        }
        return newCorrect;
      });
    } else {
      setWrongGuesses(prev => {
        const newWrong = prev + 1;
        if (newWrong >= 3 || !loggedIn) {
          setGameOver(-1); // you lose
        }
        return newWrong;
      });
    }

    setWaitForNextRound(true);


    if (!loggedIn) return;

    // add the round to the game history
    setRoundHistory(prev => [
      ...prev,
      {
        round: round + 1,
        card: tableCard,
        result: takeCard ? 'won' : 'lost'
      }
    ]);

    setRound(prev => prev + 1);

  }


  async function proceedToNextRound() {
    if (gameOver !== 0 && loggedIn) return; // se partita finita 

    // to be added in order to properly handle subsequent demo rounds
    if (!loggedIn) {
      setWaitForNextRound(false);
      setLastGuessCorrect(null);
      setCorrectGuesses(0);
      setWrongGuesses(0);
      setGameOver(0);
      navigate('/');
      return;
    }


    setWaitForNextRound(false);
    setLastGuessCorrect(null);

    try {
      const excludeIds = cards.map(c => c.bad_luck_index).concat(tableCard.bad_luck_index);
      const newCard = await fetchRandomCardExcluding(excludeIds);
      setTableCard(newCard);
    } catch (err) {
      setError("Error fetching a new card: " + err.message);
    }
    setWaitForNextRound(false);
  }


  // 2‑second delay before navigating to the results page
  useEffect(() => {
    if ((gameOver === -1 || gameOver === 1) && location.pathname === '/game') {
      const delay = setTimeout(() => {
        navigate('/game/result', { replace: true });
      }, 2000);

      return () => clearTimeout(delay);
    }
  }, [gameOver, navigate, location]);


  // Store game information at the end of the game
  useEffect(() => {
    if (gameOver !== 0 && loggedIn && user) {
      const saveGame = async () => {
        const gameData = {
          rounds: roundHistory,
          mistakeCount: wrongGuesses,
          cardsWonCount: correctGuesses,
        };

        try {
          await saveGameToDB(gameData);
        } catch (err) {
          setError('Error during saving game');
        }
      };

      saveGame(); 
    }
  }, [gameOver, loggedIn]);


  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);



  // game reset after every game end
  const resetGame = async () => {
    setLastGuessCorrect(null);
    setWaitForNextRound(false);
    setRoundHistory([]);
    setRound(-1);
    setCorrectGuesses(0);
    setWrongGuesses(0);
    setGameOver(0);
    setCards([]);
    setTableCard(null);

    hasInitialized.current = false; 

    try {
      const initialCards = await fetchThreeRandomCards();
      const excludeIds = initialCards.map(c => c.bad_luck_index);
      const newTableCard = await fetchRandomCardExcluding(excludeIds);

      setCards(initialCards.sort((a, b) => a.bad_luck_index - b.bad_luck_index));
      setTableCard(newTableCard);
      setRoundHistory(
        initialCards.map((card) => ({
          round: -1,
          card: card,
          result: -1
        }))
      );

    } catch (err) {
      setError("Error fetching initial cards: " + err.message);
    }
  };


  const handleLogin = async (credentials) => {
    try {
      const loginUser = await logIn(credentials);
      setLoggedIn(true);
      setMessage({ msg: `Welcome, ${loginUser.name}!`, type: 'success' });
      setUser(loginUser);
      navigate('/start');
    } catch (errs) {
      const validationErrors = errs.filter(e =>
        e.msg === 'The email must be a valid email address' ||
        e.msg === 'The password cannot be empty'
      );
      if (validationErrors.length > 0) {
        setError(validationErrors[0].msg);
      } else {
        setError('Invalid credentials');
      }
    }
  }

  const handleLogout = async () => {
    try {
      await logout();
      setLoggedIn(false);
      setUser(null);
      setMessage({ msg: 'Logout successful', type: 'success' });
      resetGame();
      navigate('/');
    } catch (err) {
      setError('Error during logout');
    }
  }



  useEffect(() => {
    if (message) {
      setShowMessage(true);
      const timer = setTimeout(() => setShowMessage(false), 1200); // start fade out
      const removeTimer = setTimeout(() => setMessage(null), 1700); // remove after fade
      return () => {
        clearTimeout(timer);
        clearTimeout(removeTimer);
      };
    }
  }, [message]);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#f4f7fa', position: 'relative' }}>
      {message && (
        <div
          className={`alert alert-${message.type || 'warning'}`}
          role="alert"
          style={{
            position: 'fixed',
            top: '140px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1050,
            minWidth: 300,
            maxWidth: 500,
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            opacity: showMessage ? 1 : 0,
            transition: 'opacity 0.5s ease'
          }}
        >
          {message.msg || message}
        </div>
      )}

      {error && (
        <div className="alert alert-danger mt-4" style={{ position: 'fixed', top: '90px', zIndex: 999 }}>
          {error}
        </div>
      )}


      {/* CLIENT ROUTES */}
      <Routes>
        <Route
          path="/"
          element={<Header loggedIn={loggedIn} handleLogout={handleLogout} />}
        >

          {/* Home page: welcome and choose version */}
          <Route index element={<Welcome handleLogout={handleLogout} loggedIn={loggedIn} />} />

          {/* Login */}
          <Route path="login" element={<LoginForm handleLogin={handleLogin} />} />

          {/* Start page */}
          <Route path="start" element={<StartPage loggedIn={loggedIn} />} />

          {/* Game starts */}
          <Route
            path="game"
            element={
              loading ? (
                <div className="custom-loader" />
              ) : (
                <>
                  <NewCard tableCard={tableCard} timeLeft={timeLeft} gameOver={gameOver} lastGuessCorrect={lastGuessCorrect} loggedIn={loggedIn} />
                  <ListCards
                    cards={cards}
                    onIntervalClick={handleIntervalClick}
                    waitForNextRound={waitForNextRound}
                    proceedToNextRound={proceedToNextRound}
                    gameOver={gameOver}
                    loggedIn={loggedIn}
                  />
                </>
              )
            }
          />


          {/* Game result (+ summary)*/}
          <Route
            path="game/result"
            element={<ShowResult gameOver={gameOver} resetGame={resetGame} cards={cards} onIntervalClick={handleIntervalClick}
              waitForNextRound={waitForNextRound} proceedToNextRound={proceedToNextRound} loggedIn={loggedIn}
            />}
          />

          <Route
            path="profile"
            element={
              <Profile
                userId={loggedIn && user ? user.id : null}
                loggedIn={loggedIn}
              />
            }
          />



        </Route>

      </Routes>
    </div >
  );

}

export default App;