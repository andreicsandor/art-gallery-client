import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  ButtonGroup,
  Container,
  Col,
  Form,
  FormGroup,
  Input,
  Navbar,
  Row,
} from "reactstrap";
import api from "../Api";
import Cookies from "js-cookie";
import { useLanguage } from "../services/LanguageProvider";

const LoginView = () => {
  const LoginHeader = () => {
   
    return (
      <Navbar
        className="nav py-3 mb-3"
        style={{ position: "fixed", width: "100%", zIndex: 3 }}
      >
      </Navbar>
    );
  };

  const { translations, changeLanguage } = useLanguage();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

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
      if (loggedInRole === "Administrator") {
        navigate("/admin");
      } else if (loggedInRole === "Employee") {
        navigate("/inventory");
      }
    }
  }, [navigate, changeLanguage]);

  const handleLanguageChange = (language) => {
    changeLanguage(language);
    Cookies.set("language", language);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post("/api/login", {
        username: username,
        password: password,
      });
      if (response.status === 200) {
        Cookies.set("loggedInUser", response.data.username);
        Cookies.set("loggedInRole", response.data.role);
        Cookies.set("loggedInGallery", response.data.gallery);

        const loggedInRole = Cookies.get("loggedInRole");

        if (loggedInRole === "Administrator") {
          navigate("/admin");
        } else if (loggedInRole === "Employee") {
          navigate("/inventory");
        } else {
          setErrorMessage("Invalid role.");
        }
      } else {
        setErrorMessage("Log in failed.");
      }
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 400 || error.response.status === 401)
      ) {
        setErrorMessage("Invalid username or password.");
      } else {
        console.error("An unknown error occurred:", error);
        navigate("/login");
      }
    }
  };

  const handleVisitGallery = () => {
    navigate("/gallery");
  };

  return (
    <>
      <div style={{ margin: "100px" }}></div>
      <Container className="my-5">
        <Row>
          <Col>
            <h1 className="mb-3 display-4 text-center">
              {translations["login.title"]}
            </h1>
          </Col>
        </Row>

        <Row
          className="justify-content-center"
          style={{ marginBottom: "5rem" }}
        >
          <Col md={4} className="d-flex justify-content-center">
            <ButtonGroup>
              <Button color="light" onClick={() => handleLanguageChange("en")}>
                {translations["menu.english"]}
              </Button>
              <Button color="light" onClick={() => handleLanguageChange("fr")}>
                {translations["menu.french"]}
              </Button>
              <Button color="light" onClick={() => handleLanguageChange("es")}>
                {translations["menu.spanish"]}
              </Button>
              <Button color="light" onClick={() => handleLanguageChange("ro")}>
                {translations["menu.romanian"]}
              </Button>
            </ButtonGroup>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col md={4}>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Input
                  type="text"
                  name="username"
                  id="username"
                  placeholder={translations["account.username"]}
                  bsSize="lg"
                  className="mb-3"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder={translations["account.password"]}
                  bsSize="lg"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  style={{ marginBottom: "3rem" }}
                />
              </FormGroup>

              <Row>
                <Col>
                  <Button color="dark" size="lg" block>
                    {translations["generic.loginButton"]}
                  </Button>
                </Col>
                <Col>
                  <Button
                    color="dark"
                    size="lg"
                    block
                    onClick={handleVisitGallery}
                  >
                    {translations["login.visitButton"]}
                  </Button>
                </Col>
              </Row>

              {errorMessage && (
                <div className="mt-5 mb-5 fw-bold error-message">
                  {errorMessage}
                </div>
              )}
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
    const loggedInUser = Cookies.get("loggedInUser");
    const loggedInRole = Cookies.get("loggedInRole");

    if (loggedInUser && loggedInRole) {
      // Remove session cookies
      Cookies.remove("loggedInUser");
      Cookies.remove("loggedInRole");

      // Redirect to login page
      navigate("/login");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return null;
};

export { LoginView, LogoutView };
