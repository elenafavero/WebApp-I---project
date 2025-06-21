import { useEffect, useState, useRef } from 'react';
import { fetchUserGames } from '../API/API';
import Badge from 'react-bootstrap/Badge';
import '../App.css';

function Profile(props) {
    const [games, setGames] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const hasInitialized = useRef(false);

    const { loggedIn, userId } = props;

    useEffect(() => {
        if (!loggedIn) return;
        if (hasInitialized.current) return;

        hasInitialized.current = true;

        async function fetchGames() {
            try {
                setLoading(true);
                const userGames = await fetchUserGames(userId);
                userGames.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
                setGames(userGames);
                setError(null);
            } catch (err) {
                setError({ msg: err.message, type: 'fatal' });
            } finally {
                setLoading(false);
            }
        }


        fetchGames();
    }, [loggedIn, userId]);

    const getGameResult = (game) => {
        if (game.mistake_count >= 3) return <Badge bg="danger">Lost</Badge>;
        if (game.cards_won_count >= 3) return <Badge bg="success">Won</Badge>;
        return 'In progress';
    };



    {/* Loading spinner */ }
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                <div className="custom-loader" />
            </div>
        );
    }




    const getResultBadge = (result) => {
        switch (result) {
            case 1: return <Badge bg="success">Won</Badge>;
            case 0: return <Badge bg="danger">Lost</Badge>;
            default: return <Badge bg="secondary">Initial card</Badge>;
        }
    };

    return (
        <div className="container mt-4 profile-container">
            {error ? (
                <div
                    className="alert alert-danger mt-4"
                    style={{
                        position: 'fixed',
                        top: '300px',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1050,
                        textAlign: 'center',
                    }}
                >
                    {error.msg}
                </div>
            ) : games.length === 0 ? (
                <div className="no-games-message">
                    <h2 className="no-games-title">No games yet!</h2>
                    <p className="no-games-subtitle">Start playing to see your game history here.</p>
                </div>
            ) : (
                <>
                    <h2 className="section-title text-center mb-4">User Games Overview</h2>
                    {games.map(game => (
                        <div key={game.id} className="game-table-wrapper">
                            <h3 className="game-date" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span>Game from {new Date(game.date_created).toLocaleDateString()}</span>
                                <span className="game-result">{getGameResult(game)}</span>
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
                </>
            )}
        </div>
    );
}



export default Profile;