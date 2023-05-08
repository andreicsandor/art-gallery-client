import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom"
import {
  Button,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalHeader,
  Navbar,
  Row,
  Table,
  UncontrolledDropdown,
} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AccountDTO from '../dto/AccountDTO';
import api from '../Api';


const AdminHeader = () => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const handleFilterChange = (filterType) => {
    console.log('Selected filter type:', filterType);
    // Update the filter type in your component or application state
  };

  return (
    <Navbar className="nav py-3 mb-3" style={{ position: 'fixed', width: '100%', zIndex: 3 }}>
      <div className="d-flex justify-content-center w-100">
        <ul>
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle caret>Select Filter Type</DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => handleFilterChange('Artist')}>Artist</DropdownItem>
              <DropdownItem onClick={() => handleFilterChange('Type')}>Type</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </ul>
      </div>
    </Navbar>
  );
};

function AdminView() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [formData, setFormData] = useState([]);
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await api.get('/api/get-accounts');
        setAccounts(response.data);
      } catch (error) {
        console.error('An error occurred while fetching accounts:', error);
      }
    };

    fetchAccounts();
  }, []);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const response = await api.get('/api/get-galleries');
        setGalleries(response.data);
      } catch (error) {
        console.error('An error occurred while fetching galleries:', error);
      }
    };

    fetchGalleries();
  }, []);

  const handleClick = (account) => {
    setSelectedAccount(account);
    updateFormData(account);
    toggle();
  };

  const updateFormData = (account) => {
    setFormData({
      firstName: account.profile.firstName,
      lastName: account.profile.lastName,
      role: account.profile.role,
      username: account.profile.username,
      password: account.profile.password,
      gallery: account.gallery,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "role" && value === "Employee" && galleries.length > 0) {
      setFormData((prevState) => ({ ...prevState, [name]: value, gallery: galleries[0] }));
    } else if (name === "role" && value === "Administrator") {
      setFormData((prevState) => ({ ...prevState, [name]: value, gallery: null }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  }; 

  const handleUpdate = async () => {  
    try {
      const accountDTO = new AccountDTO(
        formData.firstName,
        formData.lastName,
        formData.role,
        formData.username,
        formData.password,
        formData.gallery
      );
  
      const response = await api.put(
        `/api/update-account/${selectedAccount.profile.id}`,
        accountDTO
      );
      if (response.status === 200) {
        window.location.reload();
      } else {
        console.error("Failed to update account.");
      }
    } catch (error) {
      console.error("An error occurred while updating the account:", error);
    }
  }; 

  const handleDelete = async () => {  
    try {
      const response = await api.delete(
        `/api/delete-account/${selectedAccount.profile.id}`
      );
      if (response.status === 200) {
        window.location.reload();
      } else {
        console.error("Failed to delete account.");
      }
    } catch (error) {
      console.error("An error occurred while deleting the account:", error);
    }
  }; 

  return (
    <>
      <AdminHeader />
      <div style={{ margin: '100px' }}></div>
      <Row>
        <Col>
          <h1 className='display-5 text-center'>Manage Accounts</h1>
        </Col>
      </Row>
      <Row>
          <div className='mt-5'>
            <Table bordered hover responsive className='table-cell-center w-75' style={{margin: 'auto'}}>
              <thead>
                <tr>
                  <th>Last Name</th>
                  <th>First Name</th>
                  <th>Role</th>
                  <th>Gallery</th>
                  <th>Username</th>
                  <th>Password</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr
                    key={account.profile.id}
                    onClick={() => handleClick(account)}
                    style={{ cursor: 'pointer' }}
                  >
                  <td>{account.profile.lastName}</td>
                  <td>{account.profile.firstName}</td>
                  <td>{account.profile.role}</td>
                  <td>{account.gallery}</td>
                  <td>{account.profile.username}</td>
                  <td>
                    <input
                       type='password'
                       value={account.profile.password}
                       readOnly
                       className='form-control-plaintext'
                       style={{border: 0, background: 'none'}}
                    />
                  </td>
                  </tr>
                  ))}
              </tbody>
            </Table>
          </div>
      </Row>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Edit Account</ModalHeader>
          <div>
          {selectedAccount && formData && (
          <div className='m-5'>
             <FormGroup floating>
               <Input
                 type="text"
                 name="firstName"
                 id="firstName"
                 bsSize="default"
                 value={formData.firstName}
                 onChange={handleInputChange}
               />
               <Label for='firstName'>First Name</Label>
             </FormGroup>
             <FormGroup floating>
               <Input
                 type="text"
                 name="lastName"
                 id="lastName"
                 bsSize="default"
                 value={formData.lastName}
                 onChange={handleInputChange}
               />
               <Label for='lastName'>Last Name</Label>
             </FormGroup>
             <FormGroup floating>
               <Input
                 type="text"
                 name="username"
                 id="username"
                 bsSize="default"
                 value={formData.username}
                 onChange={handleInputChange}
               />
               <Label for='username'>Username</Label>
             </FormGroup>
             <FormGroup floating>
               <Input
                 type="password"
                 name="password"
                 id="password"
                 bsSize="default"
                 value={formData.password}
                 onChange={handleInputChange}
               />
               <Label for='password'>Password</Label>
             </FormGroup>
             <FormGroup>
               <Input
                 type='select'
                 name='role'
                 id='role'
                 bsSize='default'
                 value={formData.role}
                 onChange={(e) => {
                   handleInputChange(e);
                 }}
               >
                 <option>Administrator</option>
                 <option>Employee</option>
               </Input>
             </FormGroup>
             <FormGroup>
               <Input
                 type='select'
                 name='gallery'
                 id='gallery'
                 bsSize='default'
                 value={formData.role === 'Administrator' ? '' : formData.gallery} 
                 disabled={formData.role === 'Administrator'}
                 onChange={handleInputChange}
               >
                {formData.role === 'Employee' && galleries.map((galleryName) => (
                  <option key={galleryName}>{galleryName}</option>
                ))}
                {formData.role === 'Administrator' && (
                  <option>—</option>
                )}
               </Input>
             </FormGroup>
             <Row>
               <Col sm={6}>
                 <Button color='dark' className='mt-4 w-100' onClick={handleUpdate}>
                   Update
                 </Button>
               </Col>
               <Col sm={6}>
                 <Button color='danger' className='mt-4 w-100' onClick={handleDelete}>
                   Delete
                 </Button>
               </Col>
             </Row>
          </div>
        )}
          </div>
      </Modal>
    </>
  );
}

export default AdminView;