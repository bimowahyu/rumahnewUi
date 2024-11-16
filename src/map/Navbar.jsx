import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Nav.css';

const MyNavbar = () => {
  const navigate = useNavigate();

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="p-3">
    <Navbar.Brand href="/recap" className="d-flex align-items-center brand-content flex-grow-1">
      <img src="/images/logobaru.png" alt="Logo Aplikasi" className="homelogo" />
      <span className="brand-text">Dinas Perumahan dan Permukiman</span>
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="ms-auto text-center">
        <Nav.Link href="/recap">Rekapitulasi</Nav.Link>
        <Nav.Link href="/admin/dashboard">Dashboard</Nav.Link>
        <Nav.Link href="/questionnaire">Tambah Data</Nav.Link>
        <Nav.Link href="/upload">Upload Foto</Nav.Link>
        <button
          className="btn btn-danger ms-lg-2 mt-2 mt-lg-0"
          onClick={async () => {
            try {
              await axios.delete(`${process.env.REACT_APP_URL}/logout`, { withCredentials: true });
              sessionStorage.clear();
              navigate("/login");
            } catch (error) {
              console.error("Error during logout", error);
            }
          }}
        >
          Logout
        </button>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
  
  );
};

export default MyNavbar;
