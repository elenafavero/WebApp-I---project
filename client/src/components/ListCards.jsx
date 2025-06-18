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

            {/* LoggedIn == False: Pulsante a destra = Go back to Home Page */}
            {/*
            {!props.loggedIn && props.waitForNextRound && props.gameOver === 0 && (
                <div className="ms-4 d-flex flex-column align-items-center" style={{
                    position: 'absolute',
                    right: '70px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                }}>
                    <div
                        className="mb-3 text-center px-3 py-2"
                        style={{
                            backgroundColor: '#fff3cd',
                            color: '#856404',
                            border: '1px solid #ffeeba',
                            borderRadius: '8px',
                            boxShadow: '0 0 5px rgba(0,0,0,0.1)',

                            fontWeight: 'bold',
                            fontSize: '1rem',
                            maxWidth: '300px',
                        }}
                    >
                        Demo round finished! <br />
                        <span style={{ fontWeight: 600 }}>Log in</span> to unlock the full game experience!
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={props.proceedToNextRound}
                        style={{
                            padding: '10px 20px',
                            fontSize: '1.1rem'
                        }}
                    >
                        Home page
                    </button>
                </div>
            )}
                */}
        </div>
    );
}

export default ListCards;