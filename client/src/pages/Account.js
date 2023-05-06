import { 
    useEffect,
    React, 
    useState 
  } from 'react';
  import { 
    useNavigate 
  } from 'react-router-dom';
  import { 
    Button,
    Container, 
    Col, 
    Form,
    FormGroup,
    Input,
    Row 
  } from 'reactstrap';
  import { 
    checkAuthenticated 
  } from "../Authentication";
  import api from '../privateApi';
  
  
  const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    /*
    // Check user authentication status when the component mounts
    useEffect(() => {
      const checkAuth = async () => {
        const isAuthenticated = await checkAuthenticated();
        if (isAuthenticated) {
          navigate('/');
        }
      };
    
      checkAuth();
    }, [navigate]);
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        const response = await api.post('/api/token/', {
          username: username,
          password: password,
        });
        if (response.data.access) {
          localStorage.setItem('access_token', response.data.access);
          localStorage.setItem('refresh_token', response.data.refresh);
          navigate('/');
        } else {
          console.error('Log in failed.');
        }
      } catch (error) {
        if (error.response && error.response.status === 400 || error.response.status === 401) {
          setErrorMessage("Invalid username or password.");
        } else {
          console.error('An unknown error occurred:', error);
          navigate("/login");
        }
      }
  
    };
    */
    return (
      <>
      <div style={{margin: '100px'}}></div>
      <Container className="my-5">
        <Row>
          <Col>
            <h1 className="display-5 text-center mb-5">Login</h1>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={4}>
            <Form /* onSubmit={handleSubmit} */>
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
  
              <Button color="dark" block>Login</Button>
  
              {errorMessage && <div className="mt-5 mb-5 fw-bold error-message">{errorMessage}</div>}
  
            </Form>
          </Col>
        </Row>
      </Container>
      </>
    );
  };
  
  const Logout = () => {
    const navigate = useNavigate();
  
    useEffect(() => {
      const checkAuth = async () => {
        const isAuthenticated = await checkAuthenticated();
        if (isAuthenticated) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
        navigate('/');
      };
  
      checkAuth();
    }, [navigate]);
  
    return (
      <div></div>
    );
  };
    
  export { Login, Logout };
  