import { useNavigate } from 'react-router';
import '../App.css';
import { useEffect } from 'react';

function Welcome(props) {
    const navigate = useNavigate();

    // devi assicurare che l'utente sia disconnesso prima di accedere alla pagina di login --
    useEffect(() => {
        // If the user is already logged in, redirect to the start page
        if (props.loggedIn) {
            props.handleLogout(); // Ensure the user is logged out first
        }
    });

    return (
        <div className="welcome-container">
            <h1 className="welcome-title">
                Welcome to <span className="highlight">Stuff Happens!</span>
            </h1>
            <h4 className="welcome-subtitle">
                What version would you like to play?
            </h4>
            <div className="welcome-buttons">
                <button
                    className="btn btn-warning btn-lg welcome-btn-login"
                    onClick={() => navigate('/api/login')}
                >
                    Login to Play
                </button>
                <button
                    className="btn btn-outline-primary btn-lg welcome-btn-demo"
                    onClick={() => navigate('/api/start')}
                >
                    Play Demo Version
                </button>
            </div>
        </div>
    );
}

export default Welcome;
