import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
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
  UncontrolledDropdown,
} from "reactstrap";
import { ReactComponent as UserIcon } from "../assets/images/list.svg";
import { ReactComponent as FlagIcon } from "../assets/images/flag.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import AccountDTO from "../dto/AccountDTO";
import FilterDTO from "../dto/FilterDTO";
import api from "../Api";
import Cookies from "js-cookie";
import { useLanguage } from "../services/LanguageProvider";

function AdminView() {
  const AdminHeader = ({
    handleLanguageChange,
    toggleCreateModal,
    filterAccounts,
    clearFilter,
  }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [filterKeyword, setFilterKeyword] = useState("Administrator");

    const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

    const handleScroll = () => {
      const navbar = document.querySelector(".nav");

      if (window.scrollY > 50) {
        navbar.classList.add("navbar-scroll");
      } else {
        navbar.classList.remove("navbar-scroll");
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
              <Button className="mx-2" color="dark" onClick={toggleCreateModal}>
                {translations["generic.createButton"]}
              </Button>
              <ButtonGroup className="mx-2">
                <Button
                  color="dark"
                  onClick={() => filterAccounts(filterKeyword)}
                >
                  {translations["generic.filterButton"]}
                </Button>
                <Button color="dark" onClick={clearFilter}>
                  {translations["generic.clearButton"]}
                </Button>
              </ButtonGroup>
              <Dropdown
                className="mx-2"
                isOpen={dropdownOpen}
                toggle={toggleDropdown}
              >
                <DropdownToggle caret color="secondary">
                  {filterKeyword}
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => handleFilterKeyword("Administrator")}
                  >
                    {translations["account.optionAdmin"]}
                  </DropdownItem>
                  <DropdownItem onClick={() => handleFilterKeyword("Employee")}>
                    {translations["account.optionEmployee"]}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
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
                    <Link to="/logout">
                      {translations["generic.logoutButton"]}
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

  const [accounts, setAccounts] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState([]);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    role: "Employee",
    username: "",
    password: "",
    gallery: "The Museum of Modern Art",
  });

  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);

  const toggleUpdateModal = () => setUpdateModal(!updateModal);
  const toggleCreateModal = () => {
    setFormData({
      firstName: "",
      lastName: "",
      role: "Employee",
      username: "",
      password: "",
      gallery: "The Museum of Modern Art",
    });

    setCreateModal(!createModal);
  };

  // Check logged-in user when component mounts
  useEffect(() => {
    const loggedInUser = Cookies.get("loggedInUser");
    const loggedInRole = Cookies.get("loggedInRole");
    const savedLanguage = Cookies.get("language");

    if (savedLanguage) {
      changeLanguage(savedLanguage);
    } else {
      Cookies.set("language", "en");
    }

    if (loggedInUser && loggedInRole) {
      if (loggedInRole !== "Administrator") {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate, changeLanguage]);

  const handleLanguageChange = (language) => {
    changeLanguage(language);
    Cookies.set("language", language);
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await api.get("/api/get-accounts");
        setAccounts(response.data);
      } catch (error) {
        console.error("An error occurred while fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, []);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const response = await api.get("/api/get-galleries");
        setGalleries(response.data);
      } catch (error) {
        console.error("An error occurred while fetching galleries:", error);
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
        setFormData((prevState) => ({
          ...prevState,
          [name]: value,
          gallery: galleries[0],
        }));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          [name]: value,
          gallery: null,
        }));
      }
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const filterAccounts = async (filterKeyword) => {
    try {
      const accountFilterDTO = new FilterDTO("Role", filterKeyword);

      const response = await api.post("/api/filter-accounts", accountFilterDTO);
      setAccounts(response.data);
    } catch (error) {
      console.error(
        "An error occurred while fetching filtered accounts:",
        error
      );
    }
  };

  const clearFilter = async () => {
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

      const response = await api.post("/api/create-account", accountDTO);
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
        clearFilter={clearFilter}
        handleLanguageChange={handleLanguageChange}
      />
      <div style={{ margin: "150px" }}></div>
      <Row>
        <Col>
          <h1 className="display-5 text-center">
            {translations["account.title"]}
          </h1>
        </Col>
      </Row>
      <Row>
        <div className="mt-5">
          <Table
            bordered
            hover
            responsive
            className="table-cell-center w-75"
            style={{ margin: "auto" }}
          >
            <thead>
              <tr>
                <th>{translations["account.surname"]}</th>
                <th>{translations["account.name"]}</th>
                <th>{translations["account.role"]}</th>
                <th>{translations["account.gallery"]}</th>
                <th>{translations["account.username"]}</th>
                <th>{translations["account.password"]}</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr
                  key={account.profile.id}
                  onClick={() => handleClick(account)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{account.profile.lastName}</td>
                  <td>{account.profile.firstName}</td>
                  <td>{account.profile.role}</td>
                  <td>{account.gallery}</td>
                  <td>{account.profile.username}</td>
                  <td>
                    <input
                      type="password"
                      value={account.profile.password}
                      readOnly
                      className="form-control-plaintext"
                      style={{ border: 0, background: "none" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Row>

      <Modal isOpen={createModal} toggle={toggleCreateModal}>
        <ModalHeader toggle={toggleCreateModal}>
          {translations["account.createTitle"]}
        </ModalHeader>
        <div>
          {formData && (
            <div className="mx-5 my-4">
              <FormGroup floating>
                <Input
                  type="text"
                  name="firstName"
                  id="firstName"
                  bsSize="default"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder={translations["account.name"]}
                />
                <Label for="firstName">{translations["account.name"]}</Label>
              </FormGroup>
              <FormGroup floating>
                <Input
                  type="text"
                  name="lastName"
                  id="lastName"
                  bsSize="default"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder={translations["account.surname"]}
                />
                <Label for="lastName">{translations["account.surname"]}</Label>
              </FormGroup>
              <FormGroup floating>
                <Input
                  type="text"
                  name="username"
                  id="username"
                  bsSize="default"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder={translations["account.username"]}
                />
                <Label for="username">{translations["account.username"]}</Label>
              </FormGroup>
              <FormGroup floating>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  bsSize="default"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={translations["account.password"]}
                />
                <Label for="password">{translations["account.password"]}</Label>
              </FormGroup>
              <FormGroup>
                <Input
                  type="select"
                  name="role"
                  id="role"
                  bsSize="default"
                  value={formData.role}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                >
                  <option value="Administrator">
                    {translations["account.optionAdmin"]}
                  </option>
                  <option value="Employee">
                    {translations["account.optionEmployee"]}
                  </option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Input
                  type="select"
                  name="gallery"
                  id="gallery"
                  bsSize="default"
                  value={
                    formData.role === "Administrator" ? "" : formData.gallery
                  }
                  disabled={formData.role === "Administrator"}
                  onChange={handleInputChange}
                >
                  {formData.role === "Employee" &&
                    galleries.map((galleryName) => (
                      <option key={galleryName}>{galleryName}</option>
                    ))}
                  {formData.role === "Administrator" && <option>—</option>}
                </Input>
              </FormGroup>
              <Row>
                <Col sm={12}>
                  <Button
                    color="dark"
                    className="mt-4 mb-3 w-100"
                    onClick={handleCreate}
                  >
                    {translations["generic.createButton"]}
                  </Button>
                </Col>
              </Row>
            </div>
          )}
        </div>
      </Modal>

      <Modal isOpen={updateModal} toggle={toggleUpdateModal}>
        <ModalHeader toggle={toggleUpdateModal}>
          {translations["account.updateTitle"]}
        </ModalHeader>
        <div>
          {selectedAccount && formData && (
            <div className="mx-5 my-4">
              <FormGroup floating>
                <Input
                  type="text"
                  name="firstName"
                  id="firstName"
                  bsSize="default"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder={translations["account.name"]}
                />
                <Label for="firstName">{translations["account.name"]}</Label>
              </FormGroup>
              <FormGroup floating>
                <Input
                  type="text"
                  name="lastName"
                  id="lastName"
                  bsSize="default"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder={translations["account.surname"]}
                />
                <Label for="lastName">{translations["account.surname"]}</Label>
              </FormGroup>
              <FormGroup floating>
                <Input
                  type="text"
                  name="username"
                  id="username"
                  bsSize="default"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder={translations["account.username"]}
                />
                <Label for="username">{translations["account.username"]}</Label>
              </FormGroup>
              <FormGroup floating>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  bsSize="default"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={translations["account.password"]}
                />
                <Label for="password">{translations["account.password"]}</Label>
              </FormGroup>
              <FormGroup>
                <Input
                  type="select"
                  name="role"
                  id="role"
                  bsSize="default"
                  value={formData.role || "Employee"}
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
                  type="select"
                  name="gallery"
                  id="gallery"
                  bsSize="default"
                  value={
                    formData.role === "Administrator" ? "" : formData.gallery
                  }
                  disabled={formData.role === "Administrator"}
                  onChange={handleInputChange}
                >
                  {formData.role === "Employee" &&
                    galleries.map((galleryName) => (
                      <option key={galleryName}>{galleryName}</option>
                    ))}
                  {formData.role === "Administrator" && <option>—</option>}
                </Input>
              </FormGroup>
              <Row>
                <Col sm={6}>
                  <Button
                    color="dark"
                    className="mt-4 mb-3 w-100"
                    onClick={handleUpdate}
                  >
                    {translations["generic.updateButton"]}
                  </Button>
                </Col>
                <Col sm={6}>
                  <Button
                    color="secondary"
                    className="mt-4 mb-3 w-100"
                    onClick={handleDelete}
                  >
                    {translations["generic.deleteButton"]}
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
