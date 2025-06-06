import { useNavigate } from 'react-router';
import React, { useEffect } from 'react';

import '../App.css';

function StartPage(props) {
  const navigate = useNavigate();



  return (
    <div className="start-container">
      {props.loggedIn ? (
        <>
          <h2 className="start-title">Are you ready to start?</h2>
          <button
            className="btn btn-primary start-button"
            onClick={() => navigate('/api/round/start')}
          >
            Start New Game
          </button>
        </>
      ) : (
        <>
          <h1 className="start-title">Game Rules</h1>
          <div className="start-rules-box">
            <p className="start-intro">Welcome! Here's how to play:</p>
            <ul className="start-rules">
              <li>You play against the computer to collect 6 cards with unlucky situations.</li>
              <li>Each card has a situation, an image, and a secret "bad luck" score (1 to 100).</li>
              <li>You start with 3 random cards.</li>
              <li>Each turn, a new situation appears (only name + image).</li>
              <li>Guess where it fits among your cards based on how unlucky you think it is.</li>
              <li>Guess right in 30 seconds = you keep the card.</li>
              <li>Guess wrong or timeout = card is discarded forever.</li>
              <li>Win: collect 6 cards. Lose: 3 wrong guesses.</li>
            </ul>
          </div>
          <h2 className="start-title">Ready to play?</h2>
          <button
            className="btn btn-primary start-button"
            onClick={() => navigate('/api/round/start')}
          >
            Start New Game
          </button>
        </>
      )}
    </div>
  );
}

export default StartPage;
