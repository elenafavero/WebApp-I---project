import { useNavigate, useLocation } from 'react-router'
import React from 'react';

function Welcome(props) {
    // Hook to navigate between routes
    const navigate = useNavigate(); 
    // Hook to get the current location, used to identify the current route
    const location = useLocation();

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center" style={{ padding: '20px' }}>
            <h1 className="mb-4">Welcome to Stuff Happens!</h1>
            <button
                className="btn btn-primary"
                onClick={() => navigate('/api/round/start')}
            >
                Start New Game
            </button>
        </div>
    );
}

export default Welcome;