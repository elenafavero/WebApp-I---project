import { useNavigate, useLocation } from 'react-router-dom'
import '../App.css';
import ListCards from './ListCards.jsx';

function ShowResult(props) {
  const navigate = useNavigate();

  const handleRestart = () => {
    props.resetGame();
    navigate('/api/round/start');
  };

  const messageStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '10px 20px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    width: 'fit-content',
    marginBottom: '10px',
  };

  return (
    <div className="container" style={{ padding: '20px' }}>
      {/* Header with result + button */}
      <div className="d-flex flex-column align-items-center mb-4" style={{ position: 'sticky', top: '110px', zIndex: 10 }}>
        {props.gameOver === -1 && (
          <div
            className="alert alert-danger"
            role="alert"
            style={{
              ...messageStyle,
              backgroundColor: '#f8d7da',
              color: '#721c24',
              border: '1px solid #f5c6cb',
            }}
          >
            ❌ GAME OVER
          </div>
        )}
        {props.gameOver === 1 && (
          <div
            className="alert alert-success"
            role="alert"
            style={{
              ...messageStyle,
              backgroundColor: '#d4edda',
              color: '#155724',
              border: '1px solid #c3e6cb',
            }}
          >
            🎉 YOU WIN!
          </div>
        )}
        {props.gameOver !== 0 && (
          <button
            className="btn btn-primary"
            onClick={handleRestart}
            style={{ fontSize: '1.1rem', padding: '8px 18px' }}
          >
            Start New Game
          </button>
        )}
      </div>

      {/* ListCards appears below the result message */}
      <ListCards
        cards={props.cards}
        onIntervalClick={props.handleIntervalClick}
        waitForNextRound={props.waitForNextRound}
        proceedToNextRound={props.proceedToNextRound}
        gameOver={props.gameOver}
        loggedIn={props.loggedIn}
      />
    </div>
  );
}


export default ShowResult;



