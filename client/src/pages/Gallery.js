import React, { useEffect, useState } from 'react';
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
  InputGroup,
  InputGroupText,
  Label,
  Modal,
  ModalHeader,
  Navbar,
  Row,
} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import FilterDTO from '../DTOs/FilterDTO';
import api from '../Api';
import ExhibitDTO from '../DTOs/ExhibitDTO';


const EmployeeHeader = ({ toggleCreateModal, filterExhibits, clearFilter }) => {
  const [dropdownTypeOpen, setDropdownTypeOpen] = useState(false);
  const [dropdownKeywordOpen, setDropdownKeywordOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const [filterType, setFilterType] = useState('Type');
  const [filterKeyword, setFilterKeyword] = useState('Painting');
  const [artists, setArtists] = useState([]);

  const navbar = document.querySelector('.nav');

  const toggleDropdownType = () => setDropdownTypeOpen((prevState) => !prevState);
  const toggleDropdownKeyword = () => setDropdownKeywordOpen((prevState) => !prevState);

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
  };
  const handleSearch = () => {
    filterExhibits('Name', searchInput);
  };

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
              <DropdownToggle caret color="secondary">
                {filterType}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={() => handleFilterType('Type')}>Type</DropdownItem>
                <DropdownItem onClick={() => handleFilterType('Artist')}>Artist</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Dropdown className="mx-2" isOpen={dropdownKeywordOpen} toggle={toggleDropdownKeyword}>
              <DropdownToggle caret color="secondary">
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
            <div className="d-flex align-items-center">       
              <Input
                className="mx-2"
                type="text"
                placeholder="Name"
                value={searchInput}
                onChange={handleSearchInput}
                style={{ width: '250px' }}
              />
              <Button color="dark" onClick={handleSearch} style={{marginRight: "4rem"}}>
                Search
              </Button>   
              <Button className="mx-2" color="dark" onClick={toggleCreateModal}>Create Exhibit</Button>    
            </div>
        </div>
      </div>
    </Navbar>
  );
};

function EmployeeView() { 
  const [exhibits, setExhibits] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [selectedExhibit, setSelectedExhibit] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    artist: '',
    type: 'Painting',
    year: '',
    gallery: 'The Museum of Modern Art',
  });

  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);

  const toggleUpdateModal = () => setUpdateModal(!updateModal);
  const toggleCreateModal = () => {
    setFormData({
      name: '',
      artist: '',
      type: 'Painting',
      year: '',
      gallery: 'The Museum of Modern Art',
    });
  
    setCreateModal(!createModal);
  };
  
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

  const handleClick = (exhibit) => {
    setSelectedExhibit(exhibit);
    updateFormData(exhibit);
    toggleUpdateModal();
  };

  const updateFormData = (exhibit) => {
    setFormData({
      name: exhibit.item.name,
      artist: exhibit.item.artist,
      type: exhibit.item.type,
      year: exhibit.item.year,
      gallery: exhibit.gallery,
    });
    console.log(exhibit);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const filterExhibits = async (filterType, filterKeyword) => {
    try {
      const exhibitFilterDTO = new FilterDTO(
        filterType,
        filterKeyword,
      );

      const response = await api.post("/api/filter-exhibits", exhibitFilterDTO);
      setExhibits(response.data);
    } catch (error) {
      console.error("An error occurred while fetching filtered exhibits:", error);
    }
  };

  const clearFilter = async () => {
    window.location.reload();
  };

  const handleCreate = async () => {
    try {
      const exhibitDTO = new ExhibitDTO(
        formData.name,
        formData.artist,
        formData.type,
        formData.year,
        formData.gallery
      );
  
      const response = await api.post('/api/create-exhibit', exhibitDTO);
      if (response.status === 201) {
        window.location.reload();
      } else {
        console.error("Failed to create exhibit.");
      }
    } catch (error) {
      console.error("An error occurred while creating the exhibit:", error);
    }
  };

  const handleUpdate = async () => {  
    try {
      const exhibitDTO = new ExhibitDTO(
        formData.name,
        formData.artist,
        formData.type,
        formData.year,
        formData.gallery
      );
  
      const response = await api.put(
        `/api/update-exhibit/${selectedExhibit.item.id}`,
        exhibitDTO
      );
      if (response.status === 200) {
        window.location.reload();
      } else {
        console.error("Failed to update exhibit.");
      }
    } catch (error) {
      console.error("An error occurred while updating the exhibit:", error);
    }
  }; 

  const handleDelete = async () => {  
    try {
      const response = await api.delete(
        `/api/delete-exhibit/${selectedExhibit.item.id}`
      );
      if (response.status === 200) {
        window.location.reload();
      } else {
        console.error("Failed to delete exhibit.");
      }
    } catch (error) {
      console.error("An error occurred while deleting the exhibit:", error);
    }
  }; 

  return (
    <>
    <EmployeeHeader
        toggleCreateModal={toggleCreateModal}
        filterExhibits={filterExhibits}
        clearFilter={clearFilter}
    />
    <div style={{margin: '150px'}}></div>
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
                <Button color='light' block onClick={() => handleClick(exhibit)}>Edit</Button>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal isOpen={createModal} toggle={toggleCreateModal}>
        <ModalHeader toggle={toggleCreateModal}>Create Exhibit</ModalHeader>
          <div>
          {formData && (
          <div className='mx-5 my-4'>
             <FormGroup floating>
               <Input
                 type="text"
                 name="name"
                 id="name"
                 bsSize="default"
                 value={formData.name}
                 onChange={handleInputChange}
                 placeholder="Name"
               />
               <Label for='name'>Name</Label>
             </FormGroup>
             <FormGroup floating>
               <Input
                 type="text"
                 name="artist"
                 id="artist"
                 bsSize="default"
                 value={formData.artist}
                 onChange={handleInputChange}
                 placeholder="Artist"
               />
               <Label for='artist'>Artist</Label>
             </FormGroup>
             <FormGroup>
              <InputGroup>
                <InputGroupText>
                  Year
                </InputGroupText>
                <Input
                type="number"
                name="year"
                id="year"
                bsSize="default"
                value={formData.year}
                onChange={handleInputChange}
                placeholder="1506"
                />
              </InputGroup>
             </FormGroup>
             <FormGroup>
              <Input
                type="select"
                name="type"
                id="type"
                bsSize="default"
                value={formData.type}
                onChange={handleInputChange}
              >
                <option value="Painting">Painting</option>
                <option value="Sculpture">Sculpture</option>
              </Input>
            </FormGroup>
             <FormGroup>
               <Input
                 type='select'
                 name='gallery'
                 id='gallery'
                 bsSize='default'
                 value={formData.gallery}
                 onChange={handleInputChange}
               >
                {galleries.map((galleryName) => (
                  <option key={galleryName}>{galleryName}</option>
                ))}
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
        <ModalHeader toggle={toggleUpdateModal}>Edit Exhibit</ModalHeader>
          <div>
          {selectedExhibit && formData && (
          <div className='mx-5 my-4'>
             <FormGroup floating>
               <Input
                 type="text"
                 name="name"
                 id="name"
                 bsSize="default"
                 value={formData.name}
                 onChange={handleInputChange}
                 placeholder="Name"
               />
               <Label for='name'>Name</Label>
             </FormGroup>
             <FormGroup floating>
               <Input
                 type="text"
                 name="artist"
                 id="artist"
                 bsSize="default"
                 value={formData.artist}
                 onChange={handleInputChange}
                 placeholder="Artist"
               />
               <Label for='artist'>Artist</Label>
             </FormGroup>
             <FormGroup>
              <InputGroup>
                <InputGroupText>
                  Year
                </InputGroupText>
                <Input
                type="number"
                name="year"
                id="year"
                bsSize="default"
                value={formData.year}
                onChange={handleInputChange}
                placeholder="1506"
                />
              </InputGroup>
             </FormGroup>
             <FormGroup>
              <Input
                type="select"
                name="type"
                id="type"
                bsSize="default"
                value={formData.type}
                onChange={handleInputChange}
              >
                <option value="Painting">Painting</option>
                <option value="Sculpture">Sculpture</option>
              </Input>
            </FormGroup>
             <FormGroup>
               <Input
                 type='select'
                 name='gallery'
                 id='gallery'
                 bsSize='default'
                 value={formData.gallery} 
                 onChange={handleInputChange}
               >
                {galleries.map((galleryName) => (
                  <option key={galleryName}>{galleryName}</option>
                ))}
               </Input>
             </FormGroup>
             <Row>
               <Col sm={6}>
                 <Button color='dark' className='mt-4 mb-3 w-100' onClick={handleUpdate}>
                   Update
                 </Button>
               </Col>
               <Col sm={6}>
                 <Button color='secondary' className='mt-4 mb-3 w-100' onClick={handleDelete}>
                   Delete
                 </Button>
               </Col>
             </Row>
          </div>
          )}
          </div>
      </Modal>
    </div>
    </>
  );
}

const VisitorHeader = ({ filterExhibits, clearFilter }) => {
  const [dropdownTypeOpen, setDropdownTypeOpen] = useState(false);
  const [dropdownKeywordOpen, setDropdownKeywordOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const [filterType, setFilterType] = useState('Type');
  const [filterKeyword, setFilterKeyword] = useState('Painting');
  const [artists, setArtists] = useState([]);

  const navbar = document.querySelector('.nav');

  const toggleDropdownType = () => setDropdownTypeOpen((prevState) => !prevState);
  const toggleDropdownKeyword = () => setDropdownKeywordOpen((prevState) => !prevState);

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
  };
  const handleSearch = () => {
    filterExhibits('Name', searchInput);
  };

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
              <DropdownToggle caret color="secondary">
                {filterType}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={() => handleFilterType('Type')}>Type</DropdownItem>
                <DropdownItem onClick={() => handleFilterType('Artist')}>Artist</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Dropdown className="mx-2" isOpen={dropdownKeywordOpen} toggle={toggleDropdownKeyword}>
              <DropdownToggle caret color="secondary">
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
            <div className="d-flex align-items-center">       
              <Input
                className="mx-2"
                type="text"
                placeholder="Name"
                value={searchInput}
                onChange={handleSearchInput}
                style={{ width: '250px' }}
              />
              <Button color="dark" onClick={handleSearch} className="mx-1">
                Search
              </Button>         
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
    <div style={{margin: '150px'}}></div>
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
  