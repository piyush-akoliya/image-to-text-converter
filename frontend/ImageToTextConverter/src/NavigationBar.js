import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Cookies from "js-cookie";

function NavigationBar() {
  const handleLogout = () => {
    Cookies.remove("email");
    Cookies.remove("name");
  };
  return (
    <Navbar bg="dark" data-bs-theme="dark" style={{ color: "white" }}>
      <Container>
        <Navbar.Brand href="#home" style={{ color: "white" }}>
          Img Converter
        </Navbar.Brand>
        <Nav className="me-auto"></Nav>
        {Cookies.get("name") ? (
          <NavDropdown title={Cookies.get("name")} id="navbarScrollingDropdown">
            <NavDropdown.Item href="/" onClick={handleLogout}>
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        ) : null}
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
