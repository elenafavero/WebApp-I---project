import { Container, Navbar, Button } from 'react-bootstrap'
import { Outlet } from 'react-router'
import { useNavigate, useLocation } from 'react-router'


function Header(props) {
    // TODO: quando sei nella pagina di user History, dovrai poter tornare indietro alla schermata "start new game"
    // Hook to navigate between routes
    const navigate = useNavigate();
    // Hook to get the current location, used to identify the current route
    const location = useLocation();

    
    return (
    <>
      <Navbar className="custom-navbar" variant="dark" fixed="top">
        <Container fluid className="navbar-container">
          <h1 className="navbar-title">Stuff Happens</h1>
          {props.loggedIn && (
            <div className="navbar-buttons">
              <Button className="navbar-btn primary" onClick={() => navigate('/profile')}>
                Your Game History
              </Button>
              <Button className="navbar-btn secondary" onClick={props.handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </Container>
      </Navbar>

      <div style={{ paddingTop: '70px' }}>
        <Outlet />
      </div>
    </>
  );
}




export default Header;