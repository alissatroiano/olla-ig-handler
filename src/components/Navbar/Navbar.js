import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';

function NavbarNav() {
  return (
    <>
    <Navbar bg="transparent" data-bs-theme="light" className='shadow-lg'>
      <Container>
        <Navbar.Brand href="#">OLLA AI</Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link href="#">Home</Nav.Link>
          <Nav.Link href="#PrivacyPolicy">Privacy Policy</Nav.Link>
          <Nav.Link href="#tc">Terms & Conditions</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  </>
  );
}

export default NavbarNav;
