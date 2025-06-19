import { useNavigate, useLocation } from 'react-router';
import '../App.css';
import { useEffect } from 'react';


function Welcome(props) {
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        if (props.loggedIn) {
            props.handleLogout();
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
                    onClick={() => navigate('/login')}
                >
                    Login to Play
                </button>
                <button
                    className="btn btn-outline-primary btn-lg welcome-btn-demo"
                    onClick={() => navigate('/start')}
                >
                    Play Demo Version
                </button>
            </div>
        </div>
    );
}

export default Welcome;
