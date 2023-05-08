import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
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
} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AccountDTO from '../dto/AccountDTO';
import AccountFilterDTO from '../dto/AccountFilterDTO';
import api from '../Api';


const AdminHeader = ({ toggleCreateModal, filterAccounts, clearFilters }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filterKeyword, setFilterKeyword] = useState('Administrator');
  const navbar = document.querySelector('.nav');

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scroll');
    } else {
      navbar.classList.remove('navbar-scroll');
    }
  };

  const handleFilterKeyword = (filterKeyword) => {
    setFilterKeyword(filterKeyword);
  };

  window.addEventListener('scroll', handleScroll);

  return (
    <Navbar className="nav py-3 mb-3" style={{ position: 'fixed', width: '100%', zIndex: 3 }}>
      <div className="d-flex w-100 justify-content-center">
        <div className="d-flex w-75 justify-content-between">
          <div className="d-flex align-items-center">
            <ButtonGroup className='mx-2'>
              <Button color="dark" onClick={() => filterAccounts(filterKeyword)}>Filter</Button>
              <Button color="dark" onClick={clearFilters}>Clear</Button>
            </ButtonGroup>
            <Dropdown className="mx-2" isOpen={dropdownOpen} toggle={toggleDropdown}>
              <DropdownToggle caret color="dark">
                {filterKeyword}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={() => handleFilterKeyword('Administrator')}>Administrator</DropdownItem>
                <DropdownItem onClick={() => handleFilterKeyword('Employee')}>Employee</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div>
            <Button className="mx-2" color="dark" onClick={toggleCreateModal}>Create Account</Button>
          </div>
        </div>
      </div>
    </Navbar>
  );
};

function AdminView() {
  const [accounts, setAccounts] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState([]);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    role: 'Employee',
    username: '',
    password: '',
    gallery: 'The Museum of Modern Art',
  });

  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);

  const toggleUpdateModal = () => setUpdateModal(!updateModal);
  const toggleCreateModal = () => {
    setFormData({
      firstName: '',
      lastName: '',
      role: 'Employee',
      username: '',
      password: '',
      gallery: 'The Museum of Modern Art',
    });
  
    setCreateModal(!createModal);
  };

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
    toggleUpdateModal();
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
  
    if (name === "role") {
      if (value === "Employee") {
        setFormData((prevState) => ({ ...prevState, [name]: value, gallery: galleries[0] }));
      } else {
        setFormData((prevState) => ({ ...prevState, [name]: value, gallery: null }));
      }
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const filterAccounts = async (filterKeyword) => {
    try {
      const accountFilterDTO = new AccountFilterDTO(
        "Role",
        filterKeyword,
      );

      const response = await api.post("/api/filter-accounts", accountFilterDTO);
      setAccounts(response.data);
    } catch (error) {
      console.error("An error occurred while fetching filtered accounts:", error);
    }
  };

  const clearFilters = async () => {
    window.location.reload();
  };

  const handleCreate = async () => {
    try {
      const accountDTO = new AccountDTO(
        formData.firstName,
        formData.lastName,
        formData.role,
        formData.username,
        formData.password,
        formData.gallery
      );
  
      const response = await api.post('/api/create-account', accountDTO);
      if (response.status === 201) {
        window.location.reload();
      } else {
        console.error("Failed to create account.");
      }
    } catch (error) {
      console.error("An error occurred while creating the account:", error);
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
     <AdminHeader
        toggleCreateModal={toggleCreateModal}
        filterAccounts={filterAccounts}
        clearFilters={clearFilters}
      />
      <div style={{ margin: '150px' }}></div>
      <Row>
        <Col>
          <h5 className='display-6 text-center'>Manage Accounts</h5>
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

      <Modal isOpen={createModal} toggle={toggleCreateModal}>
        <ModalHeader toggle={toggleCreateModal}>Create Account</ModalHeader>
          <div>
          {formData && (
          <div className='mx-5 my-4'>
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
               <Col sm={12}>
                 <Button color='dark' className='mt-4 mb-3 w-100' onClick={handleCreate}>
                    Create
                  </Button>
               </Col>
             </Row>
          </div>
          )}
          </div>
      </Modal>

      <Modal isOpen={updateModal} toggle={toggleUpdateModal}>
        <ModalHeader toggle={toggleUpdateModal}>Edit Account</ModalHeader>
          <div>
          {selectedAccount && formData && (
          <div className='mx-5 my-4'>
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
                value={formData.role || 'Employee'}
                onChange={(e) => {
                  handleInputChange(e);
                }}
              >
                <option>Administrator</option>
                <option selected>Employee</option>
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
                 <Button color='dark' className='mt-4 mb-3 w-100' onClick={handleUpdate}>
                   Update
                 </Button>
               </Col>
               <Col sm={6}>
                 <Button color='danger' className='mt-4 mb-3 w-100' onClick={handleDelete}>
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