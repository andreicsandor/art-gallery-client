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


const Header = () => {

  return (
    <Navbar className="nav py-3 mb-3" style={{position: 'fixed', width: '100%', zIndex: 3}}>
      <div className="d-flex justify-content-center w-100">
        <ul>
          <Link to="/" className="link-item">Art Gallery</Link>
          <UncontrolledDropdown>
            <DropdownToggle nav className="link-item">
              <UserIcon style={{ width: '20px', height: '20px' }} />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem><Link to="/login">Login</Link></DropdownItem>
              <DropdownItem><Link to="/logout">Logout</Link></DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </ul> 
      </div>
    </Navbar>
  );
};

export default Header;