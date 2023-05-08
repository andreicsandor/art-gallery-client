import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button,
  Container, 
  Col, 
  Form,
  FormGroup,
  Input,
  Row 
} from 'reactstrap';
import api from '../Api';
  
  
const LoginView = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
      
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('/api/login', {
        username: username,
        password: password,
      });
      if (response.status === 200) {
        const role = response.data.role;
        if (role === 'Administrator') {
          navigate('/management');
        } else if (role === 'Employee') {
          navigate('/inventory');
        } else {
          setErrorMessage('Invalid role.');
        }
      } else {
        setErrorMessage('Log in failed.');
      }
    } catch (error) {
      if (error.response && (error.response.status === 400 || error.response.status === 401)) {
        setErrorMessage('Invalid username or password.');
      } else {
        console.error('An unknown error occurred:', error);
        navigate('/login');
      }
    }
  };

  const handleVisitGallery = () => {
    navigate('/gallery');
  };

  return (
    <>
    <div style={{margin: '100px'}}></div>
    <Container className="my-5">
      <Row>
        <Col>
          <h1 className="display-5 text-center mb-5">Welcome to Art Gallery</h1>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={4}>
          <Form onSubmit={handleSubmit} >
            <FormGroup>
              <Input
                type="text"
                name="username"
                id="username"
                placeholder="Username"
                bsSize="default" 
                className='mb-3'
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                bsSize="default" 
                className='mb-5'
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </FormGroup>

            <Row>
              <Col>
                <Button color="dark" block>Login</Button>
              </Col>
              <Col>
                <Button color="dark" block onClick={handleVisitGallery}>Visit Gallery</Button>
              </Col>
            </Row>
          
            {errorMessage && <div className="mt-5 mb-5 fw-bold error-message">{errorMessage}</div>}

          </Form>
        </Col>
      </Row>
    </Container>
    </>
  );
};

const LogoutView = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      navigate('/');
    };

    checkAuth();
  }, [navigate]);

  return (
    <div></div>
  );
};
  
export { LoginView, LogoutView };
  