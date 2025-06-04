import { useNavigate, useLocation } from 'react-router'
import React from 'react';

function NewCard(props) { // card
    const navigate = useNavigate();
    const location = useLocation();
    const tableCard = props.tableCard;

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center" style={{ padding: '20px' }}>

            {tableCard && (
                <div className="card" style={{ width: '12rem', height: '15rem' }}>
                    <img
                        src={tableCard.imageUrl}
                        className="card-img-top"
                        alt="Carta"
                        style={{ height: '55%', objectFit: 'cover' }}
                    />
                    <div className="card-body d-flex flex-column justify-content-between" style={{ padding: '0.4rem' }}>
                        <p className="card-text" style={{ fontSize: '0.80rem' }}>{tableCard.description}</p>
                        <p className="text-muted" style={{ fontSize: '0.80rem' }}>Bad Luck Index: {tableCard.bad_luck_index}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NewCard;

