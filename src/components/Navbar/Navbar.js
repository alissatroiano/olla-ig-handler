import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PrivacyPolicy from "../PrivacyPolicy/PrivacyPolicy";

function NavbarNav() {
  return (
    <Router>
      <Navbar bg="transparent" data-bs-theme="light" className='shadow-lg'>
        <Container>
          <Navbar.Brand as={Link} to="/">OLLA AI</Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/privacyPolicy">Privacy Policy</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
      </Routes>
    </Router>
  );
}

export default NavbarNav;
