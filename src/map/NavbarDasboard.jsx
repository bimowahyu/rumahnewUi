import React from "react";
import { Link } from "react-router-dom";
import "./NavbarDashboard.css";

export const NavbarDasboard = () => {
  return (
    <nav className="navbar">
    {/* Logo sebagai tautan ke halaman Home */}
    <Link to="/" className="navbar-logo">
      <img src="/images/logobarubg.png" alt="Logo" className="navbar-logo-image" />
    </Link>
    
    {/* Tautan navigasi */}
    <div className="navbar-links">
      <Link to="/data-perumahan" className="navbar-link">Data Perumahan</Link>
      <Link to="/data-rusun" className="navbar-link">Data Rusun</Link>
      <Link to="/peta-perumahan" className="navbar-link">Peta Perumahan</Link>
      <Link to="/informasi-dasar-hukum" className="navbar-link">Dasar Hukum</Link>
      <Link to="/login" className="navbar-link">Login</Link>
    </div>
  </nav>
  )
}
