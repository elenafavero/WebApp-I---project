import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import '../App.css'; 

// TODO: inserisci anche le 3 carte iniziali

function Profile({ allGamesHistory }) {
return (
    <Accordion className="fixed-width-accordion" defaultActiveKey="0">
        {allGamesHistory.map((game, index) => (
            <Accordion.Item eventKey={index.toString()} key={index}>
                <Accordion.Header>
                    <span style={{ fontWeight: 'bold' }}>
                        Game #{index + 1} – {game.result.toUpperCase()}: {game.correctGuesses} ✓ / {game.wrongGuesses}✗
                    </span>
                </Accordion.Header>
                <Accordion.Body>
                    {game.rounds.map((round, i) => (
                        <Card key={i} className="mb-3">
                            <Card.Body className="d-flex gap-3 align-items-center">
                                <Image src={round.card.imageUrl} alt={round.card.name} rounded style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                <div>
                                    <h5 style={{ fontWeight: 'bold' }}>{round.card.name}</h5>
                                    <p style={{ fontWeight: 'bold' }}>{round.card.description}</p>
                                    <p
                                        className={`mb-0 ${round.result === 'won' ? 'text-success' : 'text-danger'}`}
                                        style={{ fontWeight: 'bold' }}
                                    >
                                        Round {round.round + 1}: {round.result === 'won' ? 'Correct ✅' : 'Wrong ❌'}
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </Accordion.Body>
            </Accordion.Item>
        ))}
    </Accordion>
);
}

export default Profile;