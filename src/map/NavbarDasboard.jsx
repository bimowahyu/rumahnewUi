import React, { useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import './NavbarDashboard.css';

export const NavbarDasboard = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar bg="primary" variant="dark" expand="lg" expanded={expanded} className="p-3">
      <div className="d-flex w-100 align-items-center justify-content-between">
        <Navbar.Brand href="/" className="d-flex align-items-center brand-content">
          <img src="/images/logobaru.png" alt="Logo Aplikasi" className="homelogo" />
          <span className="brand-text" style={{ color: 'white', marginLeft: '5px' }}>
            Sistem Informasi Pendataan Kualitas Rumah
          </span>
        </Navbar.Brand>
        <Navbar.Toggle 
          aria-controls="basic-navbar-nav" 
          className="custom-navbar-toggler"
          onClick={() => setExpanded(expanded ? false : true)} // Toggle untuk buka/tutup navbar
        />
      </div>

      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto text-center" onClick={() => setExpanded(false)}>  
          <Nav.Link href="https://www.lapor.go.id/" style={{ color: 'white' }}>Lapor</Nav.Link>
          <Nav.Link href="/informasi-dasar-hukum" style={{ color: 'white' }}>Dasar Hukum</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
