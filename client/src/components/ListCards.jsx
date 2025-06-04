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
                    {/* Slot tra le carte */}
                    {index === 0 && (
                        <div
                            onClick={() => props.onIntervalClick(-1, 0)}
                            className="mx-1 d-flex align-items-center"
                            style={{ width: '20px', cursor: 'pointer', height: '15rem' }}
                            title="Inserisci prima della prima carta"
                        >
                            <div style={{ height: '100px', width: '100%', backgroundColor: '#ddd', borderRadius: '4px', margin: 'auto' }} />
                        </div>
                    )}

                    {/* Carta */}
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

                    {/* Slot tra carta corrente e successiva */}
                    <div
                        onClick={() => props.onIntervalClick(index, index + 1)}
                        className="mx-1 d-flex align-items-center"
                        style={{ width: '20px', cursor: 'pointer', height: '15rem' }}
                        title="Inserisci tra le carte"
                    >
                        <div style={{ height: '100px', width: '100%', backgroundColor: '#ddd', borderRadius: '4px', margin: 'auto' }} />
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
}

export default ListCards;