import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Carousel CSS
import "./Home.css"; 
import { Grafik } from "./Grafik";

function Home() {
  return (
    <div className="home-container">
        {/* Carousel and other content */}
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
        <img src="/images/logobaru.png" alt="Logo Aplikasi" className="home-logo" />
        <h1 className="app-title">Sistem Informasi Pendataan Kualitas Rumah</h1>
      </div>
    </div>
    <div className="home-text-container">
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
  
    {/* Dashboard Widgets */}
    <div className="home-text-container">
      <div>
      <Grafik />
      </div>
    </div>
  
    {/* Button Links */}
    <div className="home-text-container">
      {/* Link buttons */}
    </div>
   
  </div>
  
  );
}

export default Home;
