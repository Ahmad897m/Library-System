import React from "react";
import './header.css'
import { Container, Navbar, Form, FormControl, Dropdown } from "react-bootstrap";

const Header = () => {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm" style={{ height: '70px' }}>
      <Container fluid>
        <Navbar.Brand href="/" className="fw-bold">
          📚 Library Management
        </Navbar.Brand>

        <Form className="d-flex ms-auto me-3" style={{ maxWidth: '300px', width: '100%' }}>
          <FormControl
            type="search"
            placeholder="Search books..."
            className="me-2"
            aria-label="Search"
          />
        </Form>

        <Dropdown align="end">
          <Dropdown.Toggle variant="outline-secondary" id="dropdown-user">
            👤 Ahmad
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="#/settings">Settings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="#/logout">Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Container>
    </Navbar>
  );
}


export default Header;