import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Card, 
  CardImg, 
  CardBody, 
  CardTitle, 
  CardSubtitle, 
  Button, 
} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../Api';
  
  
function EmployeeView() {
  const navigate = useNavigate();  
  const [exhibits, setExhibits] = useState([]);
  // Fetch entries when the component mounts
  useEffect(() => {
    const fetchExhibits = async () => {
      try {
        const response = await api.get('/api/get-exhibits')
        setExhibits(response.data);
      } catch (error) {
        console.error('An error occurred while fetching exhibits:', error);
      }
    };
  
    fetchExhibits();
  }, []);

  const handleClick = (id) => {
      navigate(`/exhibits/${id}`);
  };

  return (
    <>
    <div style={{margin: '100px'}}></div>
    <Row>
      <Col>
        <h1 className='display-5 text-center'>Manage Exhibits</h1>
      </Col>
    </Row>
    <div className='m-5'>  
      <Row sm={12}>
        {exhibits.map(exhibit => (
          <Col sm={3} key={exhibit.item.id}>
            <Card className='card-shadow-custom mb-3'>
              <CardBody>
                <CardTitle tag='h5' className='mb-2'>{exhibit.item.name}</CardTitle>
                <CardSubtitle className='mb-3'>{exhibit.item.artist}</CardSubtitle>
                <ul className='list-unstyled'>
                  <li>{exhibit.item.type}, {exhibit.item.year}</li>
                  <li>{exhibit.gallery}</li>
                </ul>
                <Button color='light' block onClick={() => handleClick(exhibit.item.id)}>Edit</Button>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
    </>
  );
}
  
function VisitorView() {
  const navigate = useNavigate();  
  const [exhibits, setExhibits] = useState([]);
  // Fetch entries when the component mounts
  useEffect(() => {
    const fetchExhibits = async () => {
      try {
        const response = await api.get('/api/get-exhibits')
        setExhibits(response.data);
      } catch (error) {
        console.error('An error occurred while fetching exhibits:', error);
      }
    };
  
    fetchExhibits();
  }, []);
  
  return (
    <>
    <div style={{margin: '100px'}}></div>
    <Row>
      <Col>
        <h1 className='display-5 text-center'>Exhibits</h1>
      </Col>
    </Row>
    <div className='m-5'>  
      <Row sm={12}>
        {exhibits.map(exhibit => (
          <Col sm={3} key={exhibit.id}>
            <Card className='card-shadow-custom mb-3'>
              <CardBody>
                <CardTitle tag='h5' className='mb-2'>{exhibit.item.name}</CardTitle>
                <CardSubtitle className='mb-3'>{exhibit.item.artist}</CardSubtitle>
                <ul className='list-unstyled'>
                  <li>{exhibit.item.type}, {exhibit.item.year}</li>
                  <li>{exhibit.gallery}</li>
                </ul>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
    </>
  );
}

export { EmployeeView, VisitorView };
  