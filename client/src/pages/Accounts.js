import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Row,
  Col,
  Button,
  FormGroup,
  Input,
  Label,
  Table,
  Modal,
  ModalHeader,
} from 'reactstrap';
import api from '../Api';
import AccountDTO from '../dto/AccountDTO';

function AccountsAdmin() {
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
                  <th>Name</th>
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
                  <td>{account.profile.firstName} {account.profile.lastName}</td>
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
               </Input>
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
             <Row>
               <Col sm={6}>
                 <Button color='dark' className='mt-3 w-100' onClick={handleUpdate}>
                   Update
                 </Button>
               </Col>
               <Col sm={6}>
                 <Button color='danger' className='mt-3 w-100' onClick={handleDelete}>
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

export default AccountsAdmin;
                  
