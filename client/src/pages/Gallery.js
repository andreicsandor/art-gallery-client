import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Link 
} from "react-router-dom"
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
  ModalBody,
  ModalHeader,
  Navbar,
  Row,
  UncontrolledDropdown 
} from 'reactstrap';
import {
  DoughnutChart,
  PieChart
 } from './Charts';
import { 
  ReactComponent as UserIcon 
} from '../assets/images/three-dots.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../Api';
import ExhibitDTO from '../dto/ExhibitDTO';
import FilterDTO from '../dto/FilterDTO';
import ItemDTO from '../dto/ItemDTO';
import Cookies from 'js-cookie';
import { 
  downloadExhibitsTXT, 
  downloadExhibitsCSV, 
  downloadExhibitsJSON
} from '../services/ExporterExhibits';
import { 
  downloadItemsTXT, 
  downloadItemsCSV, 
  downloadItemsJSON
} from '../services/ExporterItems';


function EmployeeView() { 
  const EmployeeHeader = ({ toggleCreateModal, toggleExportExhibitsModal, toggleExportItemsModal, toggleStatisticsModal, filterExhibits, clearFilter }) => {
    const [dropdownTypeOpen, setDropdownTypeOpen] = useState(false);
    const [dropdownKeywordOpen, setDropdownKeywordOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');
  
    const [filterType, setFilterType] = useState('Type');
    const [filterKeyword, setFilterKeyword] = useState('Painting');
    const [artists, setArtists] = useState([]);
  
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
      const navbar = document.querySelector('.nav');
  
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
              <Button className="mx-2" color="dark" onClick={toggleCreateModal}>Create Exhibit</Button>
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
                <Button className="mx-2" color="dark" onClick={handleSearch}>Search</Button>    
                <Input
                  className="ms-2 me-4"
                  type="text"
                  placeholder="Name"
                  value={searchInput}
                  onChange={handleSearchInput}
                  style={{ width: '80%' }}
                />   
                <UncontrolledDropdown className="ms-4">
                  <DropdownToggle nav className="link-item">
                    <UserIcon style={{ width: '20px', height: '20px' }} />
                  </DropdownToggle>
                  <DropdownMenu left>
                    <DropdownItem onClick={toggleStatisticsModal}>Statistics</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem onClick={toggleExportExhibitsModal}>Exhibits data</DropdownItem>
                    <DropdownItem onClick={toggleExportItemsModal}>Sales data</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem><Link to="/logout">Logout</Link></DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
          </div>
        </div>
      </Navbar>
    );
  };

  const loggedInGallery = decodeURIComponent(Cookies.get('loggedInGallery'));

  const [exhibits, setExhibits] = useState([]);
  const [items, setItems] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [selectedExhibit, setSelectedExhibit] = useState([]);

  const [doughnutChartData, setDoughnutChartData] = useState({});
  const [pieChartData, setPieChartData] = useState({});

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    artist: '',
    type: 'Painting',
    year: '',
    gallery: 'The Museum of Modern Art',
    buyer: '',
    price: '',
    saleDate: '',
    deliveryDate: ''
  });
  
  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [sellModal, setSellModal] = useState(false);
  const [exportExhibitsModal, setExportExhibitsModal] = useState(false);
  const [exportItemsModal, setExportItemsModal] = useState(false);
  const [statisticsModal, setStatisticsModal] = useState(false);

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
  const toggleSellModal = () => setSellModal(!sellModal);
  const toggleExportExhibitsModal = () => setExportExhibitsModal(!exportExhibitsModal);
  const toggleExportItemsModal = () => setExportItemsModal(!exportItemsModal);
  const toggleStatisticsModal = () => setStatisticsModal(!statisticsModal);

  // Check logged-in user when component mounts
  useEffect(() => {
    const loggedInUser = Cookies.get('loggedInUser');
    const loggedInRole = Cookies.get('loggedInRole');

    if (loggedInUser && loggedInRole) {
      if (loggedInRole !== 'Employee') {
        navigate('/login');
      }} else {
        navigate('/login');
      }
    }, [navigate]);
  
  useEffect(() => {
    const fetchExhibits = async () => {
      try {
        const response = await api.get('/api/get-exhibits')
        setExhibits(response.data);
        setDoughnutChartData(prepareDoughnutChartData(response.data));
        setPieChartData(preparePieChartData(response.data));
      } catch (error) {
        console.error('An error occurred while fetching exhibits:', error);
      }
    };
  
    fetchExhibits();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get('/api/get-items')
        setItems(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('An error occurred while fetching items:', error);
      }
    };
  
    fetchItems();
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

  const handleClickEdit = (exhibit) => {
    setSelectedExhibit(exhibit);
    updateFormData(exhibit);
    toggleUpdateModal();
  };

  const handleClickSell = (exhibit) => {
    setSelectedExhibit(exhibit);
    updateFormData(exhibit);
    toggleSellModal();
  };

  const updateFormData = (exhibit) => {
    setFormData({
      name: exhibit.item.name,
      artist: exhibit.item.artist,
      type: exhibit.item.type,
      year: exhibit.item.year,
      gallery: exhibit.gallery,
    });
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

  const handleSell = async () => {  
    try {
      const itemDTO = new ItemDTO(
        formData.name,
        formData.artist,
        formData.type,
        formData.year,
        formData.gallery,
        formData.buyer,
        formData.price,
        formData.saleDate,
        formData.deliveryDate
      );
  
      console.log(itemDTO);

      const response = await api.post(
        `/api/sell-item/${selectedExhibit.item.id}`,
        itemDTO
      );
      
      if (response.status === 200) {
        window.location.reload();
      } else {
        console.error("Failed to sell exhibit.");
      }
    } catch (error) {
      console.error("An error occurred while selling the exhibit:", error);
    }
  }; 
  
  const prepareDoughnutChartData = (data) => {
    const artistMap = new Map();
  
    data.forEach((exhibit) => {
      const artist = exhibit.item.artist;
      artistMap.set(artist, (artistMap.get(artist) || 0) + 1);
    });
  
    const chartLabels = Array.from(artistMap.keys());
    const doughnutChartData = Array.from(artistMap.values());
  
    return {
      labels: chartLabels,
      datasets: [
        {
          data: doughnutChartData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const preparePieChartData = (data) => {
    let sculptures = 0;
    let paintings = 0;
  
    data.forEach((exhibit) => {
      if (exhibit.item.type === 'Sculpture') {
        sculptures++;
      } else if (exhibit.item.type === 'Painting') {
        paintings++;
      }
    });
  
    return {
      labels: ['Sculptures', 'Paintings'],
      datasets: [
        {
          data: [sculptures, paintings],
          backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
          borderWidth: 1,
        },
      ],
    };
  };
 
  return (
    <>
    <EmployeeHeader
        toggleCreateModal={toggleCreateModal}
        toggleExportExhibitsModal={toggleExportExhibitsModal}
        toggleExportItemsModal={toggleExportItemsModal}
        toggleStatisticsModal={toggleStatisticsModal}
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
               
                <Row>
                  <Col sm={6}>
                    <Button block color='light' onClick={() => handleClickSell(exhibit)} className='float-right' disabled={exhibit.gallery !== loggedInGallery}>Sell</Button>
                  </Col>
                  <Col sm={6}>
                    <Button block color='light' onClick={() => handleClickEdit(exhibit)}>Edit</Button>
                  </Col>
                </Row>

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
             <FormGroup floating>
                <Input
                  type="number"
                  name="year"
                  id="year"
                  bsSize="default"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="Year"
                />
                <Label for='year'>Year</Label>
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
             <FormGroup floating>
                <Input
                  type="number"
                  name="year"
                  id="year"
                  bsSize="default"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="Year"
                />
                <Label for='year'>Year</Label>
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

      <Modal isOpen={sellModal} toggle={toggleSellModal}>
        <ModalHeader toggle={toggleSellModal}>Sell Exhibit</ModalHeader>
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
                 placeholder="Name"
                 disabled
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
                 placeholder="Artist"
                 disabled
               />
               <Label for='artist'>Artist</Label>
             </FormGroup>
             <FormGroup floating>
                <Input
                  type="number"
                  name="year"
                  id="year"
                  bsSize="default"
                  value={formData.year}
                  placeholder="Year"
                  disabled
                />
                <Label for='year'>Year</Label>
              </FormGroup>
             <FormGroup>
              <Input
                type="text"
                name="type"
                id="type"
                bsSize="default"
                value={formData.type}
                disabled
              >
                <option value="Painting">Painting</option>
                <option value="Sculpture">Sculpture</option>
              </Input>
             </FormGroup>
             <FormGroup>
               <Input
                 type='text'
                 name='gallery'
                 id='gallery'
                 bsSize='default'
                 value={formData.gallery} 
                 disabled
               >
                {galleries.map((galleryName) => (
                  <option key={galleryName}>{galleryName}</option>
                ))}
               </Input>
             </FormGroup>
             <FormGroup floating>
                <Input
                  type="text"
                  name="buyer"
                  id="buyer"
                  bsSize="default"
                  value={formData.buyer}
                  onChange={handleInputChange}
                  placeholder="Buyer"
                />
                <Label for='buyer'>Buyer</Label>
              </FormGroup>
              <FormGroup floating>
                <Input
                  type="number"
                  name="price"
                  id="price"
                  bsSize="default"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Price"
                />
                <Label for='price'>Price</Label>
              </FormGroup>
              <FormGroup>
                <InputGroup>
                  <InputGroupText>
                    Sale Date
                  </InputGroupText>
                  <Input
                    type="date"
                    name="saleDate"
                    id="saleDate"
                    bsSize="default"
                    value={formData.saleDate}
                    onChange={handleInputChange}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup>
                  <InputGroupText>
                    Delivery Date
                  </InputGroupText>
                  <Input
                    type="date"
                    name="deliveryDate"
                    id="deliveryDate"
                    bsSize="default"
                    value={formData.deliveryDate}
                    onChange={handleInputChange}
                  />
                </InputGroup>
              </FormGroup>
              <Button color='dark' className='mt-4 mb-3 w-100' onClick={handleSell}>
                Sell
              </Button>
          </div>
          )}
          </div>
      </Modal>

      <Modal isOpen={exportExhibitsModal} toggle={toggleExportExhibitsModal}>
        <ModalHeader toggle={toggleExportExhibitsModal}>Export Exhibits Data</ModalHeader>
        <ModalBody>
          <Button
            color="light"
            className="mb-2 w-100"
            onClick={() => {
              downloadExhibitsCSV(exhibits);
              toggleExportExhibitsModal();
            }}
          >
            Download CSV
          </Button>
          <Button
            color="light"
            className="mb-2 w-100"
            onClick={() => {
              downloadExhibitsTXT(exhibits);
              toggleExportExhibitsModal();
            }}
          >
            Download TXT
          </Button>
          <Button
            color="light"
            className="mb-2 w-100"
            onClick={() => {
              downloadExhibitsJSON(exhibits);
              toggleExportExhibitsModal();
            }}
          >
            Download JSON
          </Button>
        </ModalBody>
      </Modal>

      <Modal isOpen={exportItemsModal} toggle={toggleExportItemsModal}>
        <ModalHeader toggle={toggleExportItemsModal}>Export Sales Data</ModalHeader>
        <ModalBody>
          <Button
            color="light"
            className="mb-2 w-100"
            onClick={() => {
              downloadItemsCSV(items);
              toggleExportItemsModal();
            }}
          >
            Download CSV
          </Button>
          <Button
            color="light"
            className="mb-2 w-100"
            onClick={() => {
              downloadItemsTXT(items);
              toggleExportItemsModal();
            }}
          >
            Download TXT
          </Button>
          <Button
            color="light"
            className="mb-2 w-100"
            onClick={() => {
              downloadItemsJSON(items);
              toggleExportItemsModal();
            }}
          >
            Download JSON
          </Button>
        </ModalBody>
      </Modal>

      <Modal 
        isOpen={statisticsModal} 
        toggle={toggleStatisticsModal} 
        size='lg'
        >
        <ModalHeader toggle={toggleStatisticsModal}>Statistics for Art Gallery</ModalHeader>
        <ModalBody>
          <div>  
            <Row sm={12}>
              <Col sm={6}>
                <Card className='mb-3'>
                  <CardBody>
                    <CardTitle tag='h5' className='mb-2'>Exhibits per Artist</CardTitle>
                    <CardSubtitle className='mb-3'>All galleries</CardSubtitle>
                    {
                      doughnutChartData.labels && doughnutChartData.labels.length > 0 && (
                        <DoughnutChart data={doughnutChartData} />
                      )
                    }
                  </CardBody>
                </Card>
              </Col>
              <Col sm={6}>
                <Card className='mb-3'>
                  <CardBody>
                    <CardTitle tag='h5' className='mb-2'>Types of Exhibits</CardTitle>
                    <CardSubtitle className='mb-3'>All galleries</CardSubtitle>
                    {
                      pieChartData.labels && pieChartData.labels.length > 0 && (
                        <PieChart data={pieChartData} />
                      )
                    }
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </ModalBody>
      </Modal>

    </div>
    </>
  );
}
  
function VisitorView() {
  const VisitorHeader = ({ filterExhibits, clearFilter }) => {
    const [dropdownTypeOpen, setDropdownTypeOpen] = useState(false);
    const [dropdownKeywordOpen, setDropdownKeywordOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');
  
    const [filterType, setFilterType] = useState('Type');
    const [filterKeyword, setFilterKeyword] = useState('Painting');
    const [artists, setArtists] = useState([]);
  
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
      const navbar = document.querySelector('.nav');
      
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
                  style={{ width: '80%' }}
                />
                <Button color="dark" onClick={handleSearch} className="mx-2">Search</Button>
            </div>
          </div>
        </div>
      </Navbar>
    );
  };

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
  