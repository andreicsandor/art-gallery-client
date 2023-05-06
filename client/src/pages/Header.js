import { 
  React, 
  useState, 
  useEffect 
} from 'react';
import { 
  Link 
} from "react-router-dom"
import { 
  Navbar, 
  DropdownItem, 
  DropdownMenu, 
  DropdownToggle, 
  UncontrolledDropdown 
} from 'reactstrap';
import { 
  ReactComponent as UserIcon 
} from '../assets/images/image-alt.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
  checkAuthenticated 
} from "../Authentication";


const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const status = await checkAuthenticated();
      setIsAuthenticated(status);
    };
  
    checkAuth();

    const navbar = document.querySelector('.nav');

    const handleScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add('navbar-scroll');
      } else {
        navbar.classList.remove('navbar-scroll');
      }
    };
    
    const handleHover = async () => {
      const status = await checkAuthenticated();
      setIsAuthenticated(status);
    };

    navbar.addEventListener('mouseenter', handleHover);
    window.addEventListener('scroll', handleScroll);
    return () => {
      navbar.removeEventListener('mouseenter', handleHover);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Navbar className="nav py-3 mb-3" style={{position: 'fixed', width: '100%', zIndex: 3}}>
      <div className="d-flex justify-content-center w-100">
        <ul>
          {!isAuthenticated && ( 
              <Link to="/" className="link-item">Welcome to Art Gallery</Link>
          )}
          <UncontrolledDropdown>
            <DropdownToggle nav className="link-item">
              <UserIcon style={{ width: '20px', height: '20px' }} />
            </DropdownToggle>
            <DropdownMenu right>
              {!isAuthenticated && ( 
              <DropdownItem><Link to="/login">Login</Link></DropdownItem>
              )}
              {isAuthenticated && ( 
              <DropdownItem><Link to="/logout">Logout</Link></DropdownItem>
              )}
            </DropdownMenu>
          </UncontrolledDropdown>
        </ul> 
      </div>
    </Navbar>
  );
};

export default Header;