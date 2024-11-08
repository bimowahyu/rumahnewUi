import React from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Carousel CSS
import "./Home.css"; // Custom styling

function Home() {
  return (
    <div className="home-container">
      {/* Carousel */}
      <div className="home-carousel">
        <Carousel showThumbs={false} infiniteLoop autoPlay>
          <div>
            <img src="/images/map1.jpg" alt="Peta 1" />
          </div>
          <div>
            <img src="/images/map2.jpg" alt="Peta 2" />
          </div>
          <div>
            <img src="/images/map3.jpg" alt="Peta 3" />
          </div>
          <div>
            <img src="/images/map4.jpg" alt="Peta 4" />
          </div>
          <div>
            <img src="/images/map5.jpg" alt="Peta 5" />
          </div>
        </Carousel>
        <div className="overlay">
          <img src="/images/logo.png" alt="Logo Aplikasi" className="home-logo" />
          <h1 className="app-title">Sistem Informasi Pendataan Kualitas Rumah Sumbawa Barat (SIP-AKURAT)</h1>
        </div>
      </div>

      {/* Button Links */}
      <div className="home-text-container">
        <Link to="/data-perumahan" className="home-button data-perumahan-button">
          <i className="home-icon">🏠</i> Data Perumahan
        </Link>
        <Link to="/data-rusun" className="home-button data-rusun-button">
          <i className="home-icon">🏢</i> Data Rusun
        </Link>
        <Link to="/peta-perumahan" className="home-button peta-perumahan-button">
          <i className="home-icon">🗺️</i> Peta Perumahan
        </Link>
        <a href="https://www.lapor.go.id/" className="home-button lapor-button" target="_blank" rel="noopener noreferrer">
          <i className="home-icon">📢</i> Lapor
        </a>
        <Link to="/informasi-dasar-hukum" className="home-button informasi-dasar-hukum-button">
          <i className="home-icon">📜</i> Informasi dan Dasar Hukum
        </Link>
        <Link to="/login" className="home-button login-button">
          <i className="home-icon">🔑</i> Login
        </Link>
      </div>
    </div>
  );
}

export default Home;
