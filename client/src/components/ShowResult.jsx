import { useNavigate, useLocation } from 'react-router-dom'

function ShowResult(props) {
    // Hook to navigate between routes
    const navigate = useNavigate();
    // Hook to get the current location, used to identify the current route
    const location = useLocation();

    const handleRestart = () => {
        props.resetGame(); // Resetta il gioco
        navigate('/api/round/start'); // Naviga
    };

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center" style={{ padding: '20px' }}>


            {props.gameOver === -1 && (
                <div className="alert alert-danger mt-3" role="alert">
                    ❌ You lost!
                </div>
            )}
            {props.gameOver === 1 && (
                <div className="alert alert-success mt-3" role="alert">
                    🎉 You won!
                </div>
            )}
            {props.gameOver !== 0 && (
                <button
                    className="btn btn-primary mt-3"
                    onClick={handleRestart}
                >
                    Start New Game
                </button>
            )}
        </div>
    )

}

export default ShowResult;



