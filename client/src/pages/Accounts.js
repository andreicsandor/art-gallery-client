import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
  Table,
} from 'reactstrap';
import api from '../Api';

function AccountsAdmin() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);

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

  const handleClick = (id) => {
    navigate(`/accounts/${id}`);
  };

  return (
    <>
      <div style={{ margin: '100px' }}></div>
      <Row>
        <Col>
          <h1 className='display-5 text-center'>Manage Accounts</h1>
        </Col>
      </Row>
      <div className='m-5'>
        <Table bordered hover responsive className="table-cell-center">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Gallery</th>
              <th>Username</th>
              <th>Password</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.profile.id}>
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
                <td className='table-cell-center-horizontal'>
                  <Button color='dark' size='sm' onClick={() => handleClick(account.profile.id)}>Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default AccountsAdmin;
