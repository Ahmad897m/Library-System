import React from "react";
import './header.css'
import { Container, Navbar, Form, FormControl, Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const Header = () => {
    const { t, i18n } = useTranslation();
      const isArabic = i18n.language === 'ar';

  
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm" style={{ height: '70px' , 
      direction: isArabic ? 'rtl' : 'ltr',
      textAlign: isArabic ? 'right' : 'left' }}>
      <Container fluid>
        <Navbar.Brand href="/" className="fw-bold">
          {t("libraryManagement")}
        </Navbar.Brand>

        <Form className="d-flex ms-auto me-3" style={{ maxWidth: '300px', width: '100%' }}>
          <FormControl
            type="search"
            placeholder={t("searchBooks")}
            className="me-2"
            aria-label="Search"
          />
        </Form>
      </Container>
    </Navbar>
  );
}


export default Header;