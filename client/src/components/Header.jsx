import { Container, Navbar, Button } from 'react-bootstrap'
import { Outlet } from 'react-router'
import { useState, useEffect } from 'react'

function Header(props) {
    // TODO: implementa il tasto User History
    // TODO: quando sei nella pagina di user History, dovrai poter tornare indietro alla schermata "start new game"
    return (
        <>
            {/* BARRA DI NAVIGAZIONE */}
            <Navbar style={{ backgroundColor: '#2196F3' }} variant="dark" fixed="top">
                <Container fluid>
                    <h1 style={{ color: 'white', margin: 0 }}>Stuff Happens</h1>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Button variant="outline-light">User History</Button>
                    </div>
                </Container>
            </Navbar>

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
            
            <div style={{ paddingTop: '70px' }}>
                <Outlet />
            </div>
        </>
    );
}


export default Header;