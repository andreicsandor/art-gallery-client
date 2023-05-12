import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardImg,
  CardSubtitle,
  CardTitle,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Navbar,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import { ReactComponent as UserIcon } from "../assets/images/list.svg";
import { ReactComponent as FlagIcon } from "../assets/images/flag.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../Api";
import FilterDTO from "../dto/FilterDTO";
import Cookies from "js-cookie";
import { useLanguage } from "../services/LanguageProvider";

function VisitorView() {
  const VisitorHeader = ({
    filterExhibits,
    clearFilter,
    handleLanguageChange,
  }) => {
    const [dropdownTypeOpen, setDropdownTypeOpen] = useState(false);
    const [dropdownKeywordOpen, setDropdownKeywordOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");

    const [filterType, setFilterType] = useState("Type");
    const [filterKeyword, setFilterKeyword] = useState("Painting");
    const [artists, setArtists] = useState([]);

    const toggleDropdownType = () =>
      setDropdownTypeOpen((prevState) => !prevState);
    const toggleDropdownKeyword = () =>
      setDropdownKeywordOpen((prevState) => !prevState);

    const handleSearchInput = (e) => {
      setSearchInput(e.target.value);
    };
    const handleSearch = () => {
      filterExhibits("Name", searchInput);
    };

    useEffect(() => {
      const fetchArtists = async () => {
        try {
          const response = await api.get("/api/get-artists");
          setArtists(response.data);
        } catch (error) {
          console.error("An error occurred while fetching artists:", error);
        }
      };

      fetchArtists();
    }, []);

    const handleScroll = () => {
      const navbar = document.querySelector(".nav");

      if (window.scrollY > 50) {
        navbar.classList.add("navbar-scroll");
      } else {
        navbar.classList.remove("navbar-scroll");
      }
    };

    const handleFilterType = (filterType) => {
      setFilterType(filterType);
      if (filterType === "Artist") {
        setFilterKeyword(artists.length > 0 ? artists[0] : "");
      } else {
        setFilterKeyword("Painting");
      }
    };

    const handleFilterKeyword = (filterKeyword) => {
      setFilterKeyword(filterKeyword);
    };

    window.addEventListener("scroll", handleScroll);

    return (
      <Navbar
        className="nav py-3 mb-3"
        style={{ position: "fixed", width: "100%", zIndex: 3 }}
      >
        <div className="d-flex w-100 justify-content-center">
          <div className="d-flex w-75 justify-content-between">
            <div className="d-flex align-items-center">
              <ButtonGroup className="mx-2">
                <Button
                  color="dark"
                  onClick={() => filterExhibits(filterType, filterKeyword)}
                >
                  {translations["generic.filterButton"]}
                </Button>
                <Button color="dark" onClick={clearFilter}>
                  {translations["generic.clearButton"]}
                </Button>
              </ButtonGroup>
              <Dropdown
                className="mx-2"
                isOpen={dropdownTypeOpen}
                toggle={toggleDropdownType}
              >
                <DropdownToggle caret color="secondary">
                  {filterType}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => handleFilterType("Type")}>
                    {translations["gallery.optionType"]}
                  </DropdownItem>
                  <DropdownItem onClick={() => handleFilterType("Artist")}>
                    {translations["gallery.optionArtist"]}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Dropdown
                className="ms-2 me-4"
                isOpen={dropdownKeywordOpen}
                toggle={toggleDropdownKeyword}
              >
                <DropdownToggle caret color="secondary">
                  {filterKeyword}
                </DropdownToggle>
                <DropdownMenu>
                  {filterType === "Artist" ? (
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
                      <DropdownItem
                        onClick={() => handleFilterKeyword("Painting")}
                      >
                        {translations["gallery.optionPainting"]}
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => handleFilterKeyword("Sculpture")}
                      >
                        {translations["gallery.optionSculpture"]}
                      </DropdownItem>
                    </>
                  )}
                </DropdownMenu>
              </Dropdown>
              <Button className="ms-4 me-2" color="dark" onClick={handleSearch}>
                {translations["generic.searchButton"]}
              </Button>
              <Input
                className="ms-2 me-5"
                type="text"
                placeholder={translations["gallery.name"]}
                value={searchInput}
                onChange={handleSearchInput}
                style={{ width: "300px" }}
              />
            </div>
            <div className="d-flex align-items-center">
              <UncontrolledDropdown className="me-4">
                <DropdownToggle nav className="link-item">
                  <FlagIcon style={{ width: "20px", height: "20px" }} />
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem onClick={() => handleLanguageChange("en")}>
                    {translations["menu.english"]}
                  </DropdownItem>
                  <DropdownItem onClick={() => handleLanguageChange("fr")}>
                    {translations["menu.french"]}
                  </DropdownItem>
                  <DropdownItem onClick={() => handleLanguageChange("es")}>
                    {translations["menu.spanish"]}
                  </DropdownItem>
                  <DropdownItem onClick={() => handleLanguageChange("ro")}>
                    {translations["menu.romanian"]}
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <UncontrolledDropdown className="ms-4">
                <DropdownToggle nav className="link-item">
                  <UserIcon style={{ width: "20px", height: "20px" }} />
                </DropdownToggle>
                <DropdownMenu left>
                  <DropdownItem>
                    <Link to="/login">
                      {" "}
                      {translations["generic.homeButton"]}
                    </Link>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </div>
        </div>
      </Navbar>
    );
  };

  const { translations, changeLanguage } = useLanguage();

  const [exhibits, setExhibits] = useState([]);

  // Check logged-in user when component mounts
  useEffect(() => {
    const savedLanguage = Cookies.get("language");

    if (savedLanguage) {
      changeLanguage(savedLanguage);
    } else {
      Cookies.set("language", "en");
    }
  }, [changeLanguage]);

  const handleLanguageChange = (language) => {
    changeLanguage(language);
    Cookies.set("language", language);
  };

  useEffect(() => {
    const fetchExhibits = async () => {
      try {
        const response = await api.get("/api/get-exhibits");
        setExhibits(response.data);
      } catch (error) {
        console.error("An error occurred while fetching exhibits:", error);
      }
    };

    fetchExhibits();
  }, []);

  const filterExhibits = async (filterType, filterKeyword) => {
    try {
      const exhibitFilterDTO = new FilterDTO(filterType, filterKeyword);

      const response = await api.post("/api/filter-exhibits", exhibitFilterDTO);
      setExhibits(response.data);
    } catch (error) {
      console.error(
        "An error occurred while fetching filtered exhibits:",
        error
      );
    }
  };

  const clearFilter = async () => {
    window.location.reload();
  };

  return (
    <>
      <VisitorHeader
        handleLanguageChange={handleLanguageChange}
        filterExhibits={filterExhibits}
        clearFilter={clearFilter}
      />
      <div style={{ margin: "150px" }}></div>
      <Row>
        <Col>
          <h1 className="display-5 text-center">
            {translations["gallery.title"]}
          </h1>
        </Col>
      </Row>
      <div className="m-5">
        <Row sm={12}>
          {exhibits.map((exhibit) => (
            <Col sm={3} key={exhibit.id}>
              <Card className="card-shadow-custom mb-3">
                {exhibit.item.image && (
                  <CardImg
                    top
                    width="100%"
                    src={exhibit.item.image}
                    alt="Exhibit"
                  />
                )}
                <CardBody>
                  <CardTitle tag="h5" className="mb-2">
                    {exhibit.item.name}
                  </CardTitle>
                  <CardSubtitle className="mb-3">
                    {exhibit.item.artist}
                  </CardSubtitle>
                  <ul className="list-unstyled">
                    <li>
                      {exhibit.item.type}, {exhibit.item.year}
                    </li>
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

export default VisitorView;
