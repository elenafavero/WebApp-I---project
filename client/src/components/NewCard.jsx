import React from 'react';

function NewCard(props) {
    const tableCard = props.tableCard;

    return (
        <>
            {/* TIMER IN ALTO A SINISTRA, MA SOTTO LA NAVBAR */}
            <div style={{
                position: 'fixed',
                top: '80px', // sposta il timer sotto la navbar
                left: '20px',
                backgroundColor: '#fff3cd',
                padding: '10px 15px',
                borderRadius: '8px',
                boxShadow: '0 0 5px rgba(0,0,0,0.1)',
                zIndex: 1000
            }}>
                {"\u23F3"} Tempo rimasto: <strong>{props.timeLeft}</strong> secondi
            </div>
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
        </>
    );
}

export default NewCard;

