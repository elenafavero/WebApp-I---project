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

    const messageStyle = {
        fontSize: '2.5rem',
        fontWeight: '700',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        marginTop: '20px',
        padding: '10px 20px',
        borderRadius: '8px',
        textAlign: 'center',
        width: 'fit-content',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    };

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center" style={{ padding: '20px' }}>
            {props.gameOver === -1 && (
                <div
                    className="alert alert-danger mt-3"
                    role="alert"
                    style={{
                        ...messageStyle,
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        border: '1px solid #f5c6cb',
                    }}
                >
                    ❌ You lost!
                </div>
            )}
            {props.gameOver === 1 && (
                <div
                    className="alert alert-success mt-3"
                    role="alert"
                    style={{
                        ...messageStyle,
                        backgroundColor: '#d4edda',
                        color: '#155724',
                        border: '1px solid #c3e6cb',
                    }}
                >
                    🎉 You won!
                </div>
            )}
            {props.gameOver !== 0 && (
                <button
                    className="btn btn-primary mt-3"
                    onClick={handleRestart}
                    style={{ fontSize: '1.25rem', padding: '10px 20px' }}
                >
                    Start New Game
                </button>
            )}
        </div>
    );

}

export default ShowResult;



