import { Container, Navbar, Button } from 'react-bootstrap'
import { Outlet } from 'react-router'
import { useState, useEffect } from 'react'

function Header(props) {
    // TODO: implementa il tasto User History
    // TODO: quando sei nella pagina di user History, dovrai poter tornare indietro alla schermata "start new game"
    return (
        <>
            <Navbar style={{ backgroundColor: '#2196F3' }} variant="dark" fixed="top">
                <Container fluid>
                    <h1 style={{ color: 'white', margin: 0 }}>Stuff Happens</h1>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Button variant="outline-light">User History</Button>
                    </div>
                </Container>
            </Navbar>
            <div style={{ paddingTop: '70px' }}>
                <Outlet />
            </div>
        </>
    );
}


export default Header;