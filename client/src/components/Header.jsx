import { Container, Navbar, Button } from 'react-bootstrap'
import { Outlet } from 'react-router'
import { useNavigate, useLocation } from 'react-router'


function Header(props) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <Navbar className="custom-navbar" variant="dark" fixed="top">
        <Container fluid className="navbar-container">
          <h1 className="navbar-title">Stuff Happens</h1>
          {props.loggedIn && (
            <div className="navbar-buttons">
              {location.pathname === '/profile' && (
                <Button
                  className="navbar-btn primary"
                  onClick={() => navigate('/start')}
                >
                  Start New Game
                </Button>
              )}
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