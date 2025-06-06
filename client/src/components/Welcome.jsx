import { useNavigate, useLocation } from 'react-router';
import '../App.css';
import { useEffect } from 'react';


function Welcome(props) {
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        if (props.loggedIn) {
            // Se l'utente è loggato e si trova su Welcome, facciamo logout o redirect
            // Se vuoi solo fare logout:
            props.handleLogout();

            // oppure se vuoi solo redirect senza logout:
            // navigate('/api/start', { replace: true });
        }
    }, [props.loggedIn, props.handleLogout, navigate]);

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
