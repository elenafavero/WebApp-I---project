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
    <div className="container" style={{ padding: '20px', position: 'relative' }}>
      {/* === TOP MESSAGE/BUTTON AREA === */}
      <div className="d-flex flex-column align-items-center mb-4" style={{ zIndex: 10 }}>
        {/* === IF LOGGED IN === */}
        {props.loggedIn && (
          <>
            {props.gameOver === -1 && (
              <div className="alert alert-danger" role="alert" style={{
                ...messageStyle,
                backgroundColor: '#f8d7da',
                color: '#721c24',
                border: '1px solid #f5c6cb',
              }}>
                GAME OVER
              </div>
            )}
            {props.gameOver === 1 && (
              <div className="alert alert-success" role="alert" style={{
                ...messageStyle,
                backgroundColor: '#d4edda',
                color: '#155724',
                border: '1px solid #c3e6cb',
              }}>
                YOU WIN!
              </div>
            )}
            {props.gameOver !== 0 && (
              <button className="btn btn-primary" onClick={handleRestart} style={{ fontSize: '1.1rem', padding: '8px 18px' }}>
                Start New Game
              </button>
            )}
          </>
        )}

        {/* === IF NOT LOGGED IN === */}
        {!props.loggedIn && props.gameOver !== 0 && (
          <div className="d-flex flex-column align-items-center" style={{}}>
            <div
              className="mb-3 text-center px-3 py-2"
              style={{
                backgroundColor: '#fff3cd',
                color: '#856404',
                border: '1px solid #ffeeba',
                borderRadius: '8px',
                boxShadow: '0 0 5px rgba(0,0,0,0.1)',
                fontWeight: 'bold',
                fontSize: '1rem',
                maxWidth: '300px',
              }}
            >
              Demo round finished! <br />
              <span style={{ fontWeight: 600 }}>Log in</span> to unlock the full game experience!
            </div>
            <button
              className="btn btn-primary"
              onClick={props.proceedToNextRound}
              style={{
                padding: '10px 20px',
                fontSize: '1.1rem'
              }}
            >
              Home page
            </button>
          </div>
        )}
      </div>

      {/* === LIST OF CARDS (always rendered) === */}
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



