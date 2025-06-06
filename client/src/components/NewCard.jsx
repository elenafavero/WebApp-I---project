import React from 'react';
import './Result.css';

function NewCard(props) {
    const tableCard = props.tableCard;
    console.log("[NEW CARD] loggedIn:", props.loggedIn);

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

            {/* Loading spinner */}
            {(props.gameOver === 1 || props.gameOver === -1) && (
                <div
                    className="d-flex flex-column align-items-center"
                    style={{
                        position: 'fixed',
                        top: '80px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1100,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center'
                    }}
                >
                    <div
                        className="spinner-border text-secondary"
                        role="status"
                        style={{ width: '1.5rem', height: '1.5rem' }}
                    />
                    <p className="mt-2 text-muted" style={{ fontSize: '0.85rem', textAlign: 'center' }}>Waiting for result...</p>
                </div>
            )}

            {/* TODO: se timer expired e sbagli per quello, scrivi "timer expired" non wrogn position */}

            {/* Messaggio di correttezza dell'ultima mossa fatta*/}
            {props.lastGuessCorrect !== null && props.gameOver === 0 && (
                <div
                    className={`feedback-message ${props.lastGuessCorrect === true
                            ? 'feedback-success'
                            : props.lastGuessCorrect === 'timeout'
                                ? 'feedback-timeout'
                                : 'feedback-error'
                        }`}
                >
                    {props.lastGuessCorrect === true
                        ? 'Correct position!'
                        : props.lastGuessCorrect === 'timeout'
                            ? 'Timer expired...'
                            : 'Wrong position'}
                </div>
            )}



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

