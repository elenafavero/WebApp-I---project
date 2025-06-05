import { useNavigate } from 'react-router';
import '../App.css';

function Welcome(props) {
    const navigate = useNavigate();

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
