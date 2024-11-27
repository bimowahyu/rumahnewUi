import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import axios from 'axios';
import './Nav.css';

const MyNavbar = () => {
  const navigate = useNavigate();
  function renderTooltip(message) {
    return <Tooltip>{message}</Tooltip>;
  }
  return (
    <Navbar variant="dark" expand="lg" className="p-3">
    <Navbar.Brand href="/recap" className="d-flex align-items-center brand-content flex-grow-1">
      <img src="/images/logobaru.png" alt="Logo Aplikasi" className="homelogo" />
      <span className="brand-text">Sistem Informasi Pendataan Kualitas Rumah</span>
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="ms-auto text-center">
        <OverlayTrigger placement="bottom" overlay={renderTooltip("Lihat Rekapitulasi Data Rumah")}>
          <Nav.Link href="/recap">Rekapitulasi</Nav.Link>
        </OverlayTrigger>
        <OverlayTrigger placement="bottom" overlay={renderTooltip("Halaman Dashboard")}>
          <Nav.Link href="/admin/dashboard">Dashboard</Nav.Link>
        </OverlayTrigger>
        <OverlayTrigger placement="bottom" overlay={renderTooltip("Tambah Data Rumah Baru")}>
          <Nav.Link href="/questionnaire">Tambah Data</Nav.Link>
        </OverlayTrigger>
        <OverlayTrigger placement="bottom" overlay={renderTooltip("Upload Foto Rumah Berdasarkan Data Yang Telah Di Input")}>
          <Nav.Link href="/upload">Upload Foto</Nav.Link>
        </OverlayTrigger>
        <OverlayTrigger placement="bottom" overlay={renderTooltip("Keluar dari Aplikasi")}>
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
        </OverlayTrigger>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
  
  );
};

export default MyNavbar;
