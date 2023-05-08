import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
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
import FilterDTO from '../DTOs/FilterDTO';
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




const VisitorHeader = ({ filterExhibits, clearFilter }) => {
  const [dropdownTypeOpen, setDropdownTypeOpen] = useState(false);
  const [dropdownKeywordOpen, setDropdownKeywordOpen] = useState(false);

  const [filterType, setFilterType] = useState('Type');
  const [filterKeyword, setFilterKeyword] = useState('Painting');
  const [artists, setArtists] = useState([]);

  const navbar = document.querySelector('.nav');

  const toggleDropdownType = () => setDropdownTypeOpen((prevState) => !prevState);
  const toggleDropdownKeyword = () => setDropdownKeywordOpen((prevState) => !prevState);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await api.get('/api/get-artists');
        setArtists(response.data);
      } catch (error) {
        console.error('An error occurred while fetching artists:', error);
      }
    };

    fetchArtists();
  }, []);

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scroll');
    } else {
      navbar.classList.remove('navbar-scroll');
    }
  };

  const handleFilterType = (filterType) => {
    setFilterType(filterType);
    if (filterType === 'Artist') {
      setFilterKeyword(artists.length > 0 ? artists[0] : '');
    } else {
      setFilterKeyword('Painting');
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
              <Button color="dark" onClick={() => filterExhibits(filterType, filterKeyword)}>Filter</Button>
              <Button color="dark" onClick={clearFilter}>Clear</Button>
            </ButtonGroup>
            <Dropdown className="mx-2" isOpen={dropdownTypeOpen} toggle={toggleDropdownType}>
              <DropdownToggle caret color="dark">
                {filterType}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={() => handleFilterType('Type')}>Type</DropdownItem>
                <DropdownItem onClick={() => handleFilterType('Artist')}>Artist</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Dropdown className="mx-2" isOpen={dropdownKeywordOpen} toggle={toggleDropdownKeyword}>
              <DropdownToggle caret color="dark">
                {filterKeyword}
              </DropdownToggle>
              <DropdownMenu>
                {filterType === 'Artist' ? (
                  artists.map((artist) => (
                    <DropdownItem
                      key={artist}
                      onClick={() => handleFilterKeyword(artist)}
                    >
                      {artist}
                    </DropdownItem>
                  ))
                ) : (
                  <>
                    <DropdownItem onClick={() => handleFilterKeyword('Administrator')}>Administrator</DropdownItem>
                    <DropdownItem onClick={() => handleFilterKeyword('Employee')}>Employee</DropdownItem>
                  </>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    </Navbar>
  );
};
  
function VisitorView() {
  const [exhibits, setExhibits] = useState([]);

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

  const filterExhibits = async (filterType, filterKeyword) => {
    try {
      const exhibitFilterDTO = new FilterDTO(
        filterType,
        filterKeyword,
      );

      console.log(exhibitFilterDTO);

      const response = await api.post("/api/filter-exhibits", exhibitFilterDTO);
      setExhibits(response.data);
    } catch (error) {
      console.error("An error occurred while fetching filtered exhibits:", error);
    }
  };

  const clearFilter = async () => {
    window.location.reload();
  };
  
  return (
    <>
    <VisitorHeader
        filterExhibits={filterExhibits}
        clearFilter={clearFilter}
    />
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
  