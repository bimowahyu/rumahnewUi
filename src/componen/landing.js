import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import { Grafik } from './Grafik';

// Import images
import map1 from '../images/map1.jpg';
import map2 from '../images/map2.jpg';
import map3 from '../images/map3.jpg';
import map4 from '../images/map4.jpg';
import map5 from '../images/map5.jpg';

function Home() {
  const navigate = useNavigate();
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  
  // Background images array
  const backgroundImages = [map1, map2, map3, map4, map5];
  
  // Features data
  const featuresData = [
    { 
      id: 1, 
      title: 'Presensi online', 
      description: 'Sistem presensi berbasis foto selfie untuk memastikan kehadiran.' 
    },
    { 
      id: 2, 
      title: 'Jurnal Terintegrasi', 
      description: 'Pencatatan aktivitas harian dengan fitur unggah dokumentasi kegiatan yang memudahkan pelaporan dan evaluasi progress magang.' 
    },
    { 
      id: 3, 
      title: 'Monitoring Real-time', 
      description: 'Pemantauan kegiatan magang secara langsung oleh pembimbing dan admin untuk memastikan kualitas pelaksanaan program.' 
    },
  ];
  
  // Navigation handler
  const handleLogin = () => {
    navigate('/login');
  };

  // Automatic background scrolling
  useEffect(() => {
    const backgroundInterval = setInterval(() => {
      setBackgroundIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(backgroundInterval);
  }, [backgroundImages.length]);

  // Features horizontal scrolling
  useEffect(() => {
    const featuresElement = document.getElementById('features-grid');
    if (!featuresElement) return;
    
    let scrollPosition = 0;
    const scrollWidth = featuresElement.scrollWidth;
    const clientWidth = featuresElement.clientWidth;
    const maxScroll = scrollWidth - clientWidth;
    
    const scrollInterval = setInterval(() => {
      if (scrollPosition >= maxScroll) {
        scrollPosition = 0;
      } else {
        scrollPosition += 1;
      }
      
      featuresElement.scrollLeft = scrollPosition;
    }, 30);

    return () => clearInterval(scrollInterval);
  }, []);

  return (
    <div className="landing-page">
      {/* Hero Section with Auto-Scrolling Background */}
      <section 
        className="hero-section" 
        style={{ 
          backgroundImage: `url(${backgroundImages[backgroundIndex]})`,
          transition: 'background-image 1s ease-in-out'
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="hero-content"
        >
          <img src="/images/logobaru.png" alt="Logo Aplikasi" className="home-logo" />
          <h1>SIDALIMAH</h1>
          <p>Sistem Informasi Pendataan Kualitas Rumah</p>
          <button onClick={handleLogin} className="cta-button">Masuk</button>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          Tentang SIDALIMAH
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          SIDALIMAH hadir sebagai solusi modern untuk mengoptimalkan pengelolaan proses pendataan kualitas rumah.
          Sistem ini meliputi pendataan kualitas rumah dan foto rumah untuk memastikan dokumentasi 
          yang akurat dan pemantauan yang efektif. Dengan SIDALIMAH, proses oendataan kualitas rumah menjadi lebih terstruktur dan transparan bagi semua 
          pihak yang terlibat.
        </motion.p>
      </section>

      {/* Features Section */}
      <section>
      <Grafik/>
      </section>
    

      {/* Image and Text Section */}
      <section className="image-text-section">
        <motion.div
          className="image-text-item"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 1 }}
        >
          <img src={map1} alt="Visi Kami" className="image" />
          <div className="text">
            <h3>Visi Kami</h3>
            <p>Menjadi platform unggulan dalam pengelolaan program magang yang mendukung pengembangan kompetensi siswa melalui teknologi digital yang terintegrasi.</p>
          </div>
        </motion.div>
        
        <motion.div
          className="image-text-item reverse"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 1 }}
        >
          <img src={map2} alt="Misi Kami" className="image" />
          <div className="text">
            <h3>Misi Kami</h3>
            <p>Memfasilitasi proses magang yang terstruktur dan transparan melalui sistem monitoring digital yang efektif, serta mendorong peningkatan kualitas program magang berbasis data.</p>
          </div>
        </motion.div>

        <motion.div
          className="image-text-item"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 1 }}
        >
          <img src={map3} alt="Nilai-Nilai Kami" className="image" />
          <div className="text">
            <h3>Nilai-Nilai Kami</h3>
            <p>Kami mengedepankan akuntabilitas, efisiensi, dan inovasi dalam mengembangkan solusi digital untuk mendukung kesuksesan program magang para siswa.</p>
          </div>
        </motion.div>
      </section>

      {/* Footer Section */}
      <footer className="footer-section">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          Contact Us
        </motion.h2>
        <div className="footer-content">
          {/* <p><strong>SMK N 9 Semarang</strong></p> */}
          <p>Jln. Bung Karno No.3 Komplek KTC. Taliwang, Kabupaten Sumbawa Barat. NTB Kode Pos 84355</p>
          <p>Phone: (0372) 8281747, 8281748 </p>
          <p>Email: prokopimksb@gmail.com</p>
          <div className="social-icons">
            {/* Social icons can go here */}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;