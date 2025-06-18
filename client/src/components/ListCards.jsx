import { useNavigate, useLocation } from 'react-router'
import React from 'react';


function ListCards(props) { // cards
    const navigate = useNavigate();
    const location = useLocation();



    const cards = props.cards;

    return (
        <div className="d-flex justify-content-center gap-0" style={{ width: '100%' }}>
            {cards.map((card, index) => (
                <React.Fragment key={index}>
                    {/* Slot between cards */}
                    {index === 0 && props.gameOver === 0 && (
                        <div
                            onClick={() => props.onIntervalClick(-1, 0)}
                            className="mx-1 d-flex align-items-center"
                            style={{ width: '20px', cursor: 'pointer', height: '15rem' }}
                            title="Inserisci prima della prima carta"
                        >
                            <div className="card-slot-inner">+</div>
                        </div>
                    )}
                    {/* Card */}
                    <div className="card mx-1" style={{ width: '12rem', height: '15rem' }}>
                        <img
                            src={card.imageUrl}
                            className="card-img-top"
                            alt={card.description}
                            style={{ height: '55%', objectFit: 'cover' }}
                        />
                        <div className="card-body d-flex flex-column justify-content-between">
                            <p className="card-text" style={{ fontSize: '0.80rem' }}>{card.description}</p>
                            <p className="text-muted" style={{ fontSize: '0.80rem' }}>Bad Luck Index: {card.bad_luck_index}</p>
                        </div>
                    </div>

                    {/* Slot between current card and next card */}
                    {props.gameOver === 0 && (
                        <div
                            onClick={() => props.onIntervalClick(index, index + 1)}
                            className="mx-1 d-flex align-items-center"
                            style={{ width: '20px', cursor: 'pointer', height: '15rem' }}
                            title="Inserisci tra le carte"
                        >
                            <div className="card-slot-inner">+</div>
                        </div>
                    )}
                    </React.Fragment>
                ))}
                
            {props.loggedIn && props.waitForNextRound && props.gameOver === 0 && (
                <div className="ms-4" style={{
                    position: 'absolute',
                    right: '70px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                }}>
                    <button
                        className="btn btn-primary"
                        onClick={props.proceedToNextRound}
                        style={{
                            padding: '10px 20px',
                            fontSize: '1.1rem'
                        }}
                    >
                        Next Round
                    </button>
                </div>
            )}

        </div>
    );
}

export default ListCards;