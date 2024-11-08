import React from "react";
// import "./Header.css";

function Header() {
  return (
    <header className="App-header">
      <img src={process.env.PUBLIC_URL + "/images/logo-sumbawa-barat.png"} className="App-logo" alt="logo" />
      <div className="header-text">
        <h2 className="header-title">Pemerintah Kabupaten Sumbawa Barat</h2>
        <h2 className="header-subtitle">Dinas Perumahan dan Permukiman</h2>
        <p className="header-subtitle">Jl. Bung Karno Nomor. 007 Komplek KTC-Taliwang-KSB</p>
      </div>
    </header>
  );
}

export default Header;
