import { useEffect, useState, useRef } from 'react';
import { getUserGames } from '../API/API';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import '../App.css';

function Profile(props) {
    const [games, setGames] = useState([]);
    const [error, setError] = useState(null);
    const hasInitialized = useRef(false);

    const { loggedIn, userId } = props;

    useEffect(() => {
        if (!loggedIn) return;
        if (hasInitialized.current) return;

        hasInitialized.current = true;

        async function fetchGames() {
            try {
                const userGames = await getUserGames(userId);
                userGames.sort((a, b) => new Date(b.date_created) - new Date(a.date_created)); // Ordina per data decrescente
                setGames(userGames);
                setError(null);
            } catch (err) {
                setError(err.message);
            }
        }

        fetchGames();
    }, [loggedIn, userId]);

    const getGameResult = (game) => {
        if (game.mistake_count >= 3) return <Badge bg="danger">Lost</Badge>;
        if (game.cards_won_count >= 3) return <Badge bg="success">Won</Badge>;
        return 'In progress';
    };


    if (error) return <p className="text-danger text-center mt-4">Error: {error}</p>;
    if (games.length === 0)
        if (games.length === 0)
            return (
                <div className="no-games-message">
                    <h2 className="no-games-title">No games yet!</h2>
                    <p className="no-games-subtitle">Start playing to see your game history here.</p>
                </div>
            );





    const getResultBadge = (result) => {
        switch (result) {
            case 1: return <Badge bg="success">Won</Badge>;
            case 0: return <Badge bg="danger">Lost</Badge>;
            default: return <Badge bg="secondary">Initial card</Badge>;
        }
    };

    return (
        <div className="container mt-4 profile-container">
            <h2 className="mb-4 text-center">User Games Overview</h2>
            {games.map(game => (
                <div key={game.id} className="game-table-wrapper">
                    <h3 className="game-date" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span>
                            Game from {new Date(game.date_created).toLocaleDateString()}
                        </span>
                        <span className="game-result">
                            {getGameResult(game)}
                        </span>
                    </h3>
                    <div className="game-stats" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span><b>Mistakes:</b> {game.mistake_count}</span>
                        <span><b>Cards Won:</b> {game.cards_won_count}</span>
                        <span style={{ marginLeft: 'auto' }}><b>Total Cards collected:</b> {game.cards_won_count + 3}</span>
                    </div>
                    <table className="game-rounds-table">
                        <thead>
                            <tr>
                                <th>Round #</th>
                                <th>Card</th>
                                <th>Description</th>
                                <th>Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            {game.rounds.map(round => (
                                <tr key={round.id}>
                                    <td>{round.round_number === -1 ? `initial card` : round.round_number}</td>
                                    <td>
                                        <img
                                            src={round.card.image_url}
                                            alt={round.card.description}
                                            className="round-card-image"
                                        />
                                    </td>
                                    <td>{round.card.description}</td>
                                    <td>{getResultBadge(round.is_won)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
}



export default Profile;