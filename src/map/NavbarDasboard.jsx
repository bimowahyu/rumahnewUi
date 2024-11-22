import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';

import './NavbarDashboard.css';

export const NavbarDasboard = () => {
  // const navigate = useNavigate();

  return (
    // <Navbar bg="primary" variant="dark" expand="lg" className="p-3">
    <Navbar bg="primary" variant="dark" expand="lg" className="p-3 justify-content-between">
      <Navbar.Brand href="/" className="d-flex align-items-center brand-content">
        {/* Logo */}
        <img src="/images/logobaru.png" alt="Logo Aplikasi" className="homelogo" />
        {/* Navbar text */}
        <span className="brand-text" style={{ color: 'white', marginLeft: '1px' }}>
        Sistem Informasi Pendataan Kualitas Rumah
        </span>
      </Navbar.Brand>
      {/* Toggle Button for mobile view */}
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto text-center">
          <Nav.Link href="https://www.lapor.go.id/" style={{ color: 'white' }}>Lapor</Nav.Link>
          <Nav.Link href="/informasi-dasar-hukum" style={{ color: 'white' }}>Dasar Hukum</Nav.Link>
          {/* <Nav.Link href="/questionnaire" style={{ color: 'white' }}>Tambah Data</Nav.Link>
          <Nav.Link href="/upload" style={{ color: 'white' }}>Upload Foto</Nav.Link> */}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};


