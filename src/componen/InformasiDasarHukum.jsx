import React, { useState, useEffect } from "react";
import { NavbarDasboard } from "../map/NavbarDasboard";
import axios from "axios";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { fullScreenPlugin } from "@react-pdf-viewer/full-screen";
import { thumbnailPlugin } from "@react-pdf-viewer/thumbnail";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/thumbnail/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";
import { FaDownload, FaExpand, FaFileAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import Footer from "./Footer";
import "./InformasiDasarHukum.css";

function InformasiDasarHukum() {
  const [pdfList, setPdfList] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize plugins
  const fullScreenPluginInstance = fullScreenPlugin();
  const thumbnailPluginInstance = thumbnailPlugin();
  const zoomPluginInstance = zoomPlugin();
  const toolbarPluginInstance = toolbarPlugin();
  const { Toolbar } = toolbarPluginInstance;
  const { EnterFullScreen } = fullScreenPluginInstance;

  useEffect(() => {
    const fetchPdfList = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/pdf`, {
          withCredentials: true,
        });
        setPdfList(response.data.data);
      } catch (error) {
        console.error("Error fetching PDF list:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPdfList();
  }, []);

  const handleDownload = async (filename) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/download/${filename}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const handleView = (pdfPath) => {
    setSelectedPdf(pdfPath);
    // Scroll to viewer
    setTimeout(() => {
      const viewer = document.getElementById("pdf-viewer-section");
      if (viewer) {
        viewer.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <>
      <NavbarDasboard />
      <div className="informasi-container">
        <motion.div 
          className="hero-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="hero-title">Sistem Informasi Pendataan Kualitas Rumah (SIDALIMAH)</h1>
          <div className="hero-divider"></div>
          <p className="hero-subtitle">Mewujudkan Hunian Layak dan Berkelanjutan untuk Masyarakat Kabupaten Sumbawa Barat</p>
        </motion.div>

        <div className="content-container">
          <div className="info-content">
            <motion.section 
              className="info-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <h2 className="info-heading">Latar Belakang</h2>
              <div className="info-card-content">
                <p>
                  Pendataan kualitas rumah adalah bagian penting dari upaya pemerintah daerah dalam menyediakan hunian yang layak bagi masyarakat. 
                  Kualitas rumah yang tidak memadai dapat berdampak negatif pada kesehatan, kenyamanan, dan keselamatan penghuninya.
                </p>
                <p>
                  Di Kabupaten Sumbawa Barat, program pembangunan rumah layak huni dan perbaikan rumah tidak layak huni memerlukan data yang akurat dan dapat diandalkan. 
                  Pendataan secara manual sering menemui kendala, seperti:
                </p>
                <ul className="modern-list">
                  <li>Kesalahan pencatatan akibat proses yang tidak terstandardisasi.</li>
                  <li>Kurangnya koordinasi antara tim lapangan dan pengambil keputusan.</li>
                  <li>Keterlambatan proses pengumpulan data, yang memperlambat pelaksanaan program bantuan.</li>
                </ul>
                <p>
                  Untuk menjawab tantangan ini, Sistem Informasi Pendataan Kualitas Rumah (SIDALIMAH) dirancang sebagai solusi
                  modern yang mengintegrasikan teknologi untuk meningkatkan akurasi, efisiensi, dan kemudahan akses data.
                </p>
              </div>
            </motion.section>

            <motion.section 
              className="info-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <h2 className="info-heading">Tujuan Sistem</h2>
              <div className="info-card-content">
                <ul className="objective-list">
                  <li>
                    <div className="objective-icon">✓</div>
                    <div className="objective-text">Meningkatkan efisiensi proses pendataan melalui digitalisasi.</div>
                  </li>
                  <li>
                    <div className="objective-icon">✓</div>
                    <div className="objective-text">Memastikan keakuratan data sehingga program bantuan dapat tepat sasaran.</div>
                  </li>
                  <li>
                    <div className="objective-icon">✓</div>
                    <div className="objective-text">Memberikan laporan dan analisis real-time kepada pemerintah daerah.</div>
                  </li>
                  <li>
                    <div className="objective-icon">✓</div>
                    <div className="objective-text">Mempermudah pelacakan kondisi rumah di seluruh wilayah Kabupaten Sumbawa Barat.</div>
                  </li>
                </ul>
              </div>
            </motion.section>

            <motion.section 
              className="info-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <h2 className="info-heading">Sasaran Program</h2>
              <div className="info-card-content">
                <div className="target-grid">
                  <div className="target-item">
                    <h3 className="target-title">Pemerintah Daerah</h3>
                    <ul className="target-list">
                      <li>Sebagai alat bantu dalam merumuskan kebijakan.</li>
                      <li>Memberikan laporan berkala terkait jumlah dan kondisi rumah layak huni, rumah tidak layak huni, serta data backlog.</li>
                    </ul>
                  </div>
                  <div className="target-item">
                    <h3 className="target-title">Surveyor Lapangan</h3>
                    <ul className="target-list">
                      <li>Mempermudah pekerjaan surveyor dengan perangkat yang terintegrasi.</li>
                      <li>Mengurangi kesalahan pencatatan dengan sistem otomatis.</li>
                    </ul>
                  </div>
                  <div className="target-item">
                    <h3 className="target-title">Masyarakat</h3>
                    <ul className="target-list">
                      <li>Mendapatkan kepastian bahwa rumah mereka telah terdata dengan baik.</li>
                      <li>Mempercepat proses bantuan kepada masyarakat yang membutuhkan.</li>
                    </ul>
                  </div>
                  <div className="target-item">
                    <h3 className="target-title">Program Bantuan Pemerintah</h3>
                    <ul className="target-list">
                      <li>Mendukung program seperti bantuan renovasi rumah, pembangunan rumah layak huni, atau penanganan pascabencana.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section 
              className="info-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <h2 className="info-heading">Fitur Utama Sistem</h2>
              <div className="info-card-content">
                <div className="features-container">
                  <div className="feature-item">
                    <div className="feature-number">01</div>
                    <h3 className="feature-title">Dashboard</h3>
                    <ul className="feature-list">
                      <li>Menampilkan data rekapan hasil survei secara visual.</li>
                      <li>Memberikan laporan berbasis kategori rumah layak dan tidak layak huni, serta data backlog.</li>
                    </ul>
                  </div>
                  <div className="feature-item">
                    <div className="feature-number">02</div>
                    <h3 className="feature-title">Pendataan Digital di Lapangan</h3>
                    <ul className="feature-list">
                      <li>Formulir berbasis digital dengan 58 pertanyaan terkait kondisi rumah.</li>
                      <li>Hasil survei otomatis tersimpan di database pusat.</li>
                    </ul>
                  </div>
                  <div className="feature-item">
                    <div className="feature-number">03</div>
                    <h3 className="feature-title">Analisis Otomatis Kelayakan Rumah</h3>
                    <ul className="feature-list">
                      <li>Sistem memberikan hasil "Layak Huni" atau "Tidak Layak Huni" berdasarkan skor.</li>
                      <li>Menggunakan bobot nilai yang telah ditentukan (di bawah 45%: Rumah Layak Huni, di atas 45%: Rumah Tidak Layak Huni, Jumlah KK lebih dari 1: Backlog).</li>
                    </ul>
                  </div>
                  <div className="feature-item">
                    <div className="feature-number">04</div>
                    <h3 className="feature-title">Integrasi dengan Peta Lokasi</h3>
                    <ul className="feature-list">
                      <li>Menggunakan Google Maps untuk memetakan rumah yang telah disurvei.</li>
                      <li>Mempermudah pelacakan lokasi fisik rumah.</li>
                    </ul>
                  </div>
                  <div className="feature-item">
                    <div className="feature-number">05</div>
                    <h3 className="feature-title">Pengunduhan Laporan</h3>
                    <ul className="feature-list">
                      <li>Data survei dapat diunduh dalam format Excel untuk analisis lebih lanjut.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section 
              className="info-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <h2 className="info-heading">Langkah-Langkah Pelaksanaan</h2>
              <div className="info-card-content">
                <div className="steps-container">
                  <div className="step-item">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h3 className="step-title">Pelatihan Surveyor</h3>
                      <p>Surveyor diberikan pelatihan teknis terkait cara penggunaan sistem, standar penilaian rumah, dan teknik komunikasi dengan masyarakat.</p>
                    </div>
                  </div>
                  <div className="step-item">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h3 className="step-title">Penyebaran Surveyor</h3>
                      <p>Tim surveyor diterjunkan ke lokasi sesuai zona tanggung jawab yang ditentukan.</p>
                    </div>
                  </div>
                  <div className="step-item">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h3 className="step-title">Pengumpulan Data Digital</h3>
                      <p>Data diinput menggunakan perangkat seperti tablet atau smartphone, kemudian disinkronisasi ke server pusat.</p>
                    </div>
                  </div>
                  <div className="step-item">
                    <div className="step-number">4</div>
                    <div className="step-content">
                      <h3 className="step-title">Pengolahan dan Analisis Data</h3>
                      <p>Sistem secara otomatis menghitung kelayakan rumah berdasarkan kriteria bobot yang telah ditetapkan.</p>
                    </div>
                  </div>
                  <div className="step-item">
                    <div className="step-number">5</div>
                    <div className="step-content">
                      <h3 className="step-title">Pelaporan dan Tindak Lanjut</h3>
                      <p>Data diproses oleh tim admin untuk diserahkan kepada pengambil kebijakan.</p>
                      </div>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section 
              className="info-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <h2 className="info-heading">Kompetensi Surveyor</h2>
              <div className="info-card-content">
                <p className="competency-intro">Surveyor adalah bagian penting dari kesuksesan program ini. Mereka bertugas mengumpulkan data teknis di lapangan dan memastikan keabsahan informasi yang diberikan. Beberapa kriteria yang harus dimiliki oleh surveyor:</p>
                
                <div className="competency-grid">
                  <div className="competency-item">
                    <div className="competency-icon">🎓</div>
                    <div className="competency-text">
                      <strong>Lulusan minimal S-1 Teknik Sipil</strong>, Arsitektur, atau bidang terkait dengan pemahaman mendalam tentang konstruksi bangunan
                    </div>
                  </div>
                  <div className="competency-item">
                    <div className="competency-icon">📜</div>
                    <div className="competency-text">
                      <strong>Memiliki sertifikasi atau pengalaman kerja</strong> di bidang survei bangunan atau konstruksi
                    </div>
                  </div>
                  <div className="competency-item">
                    <div className="competency-icon">💻</div>
                    <div className="competency-text">
                      <strong>Kompeten dalam menggunakan perangkat digital</strong> untuk pengisian data dan koordinasi
                    </div>
                  </div>
                  <div className="competency-item">
                    <div className="competency-icon">🗣️</div>
                    <div className="competency-text">
                      <strong>Mampu berkomunikasi dengan baik</strong> untuk menjelaskan tujuan survei kepada masyarakat
                    </div>
                  </div>
                  <div className="competency-item">
                    <div className="competency-icon">📊</div>
                    <div className="competency-text">
                      <strong>Memahami standar kelayakan rumah</strong> yang telah ditetapkan pemerintah
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section 
              className="info-card conclusion-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <h2 className="info-heading">Kesimpulan</h2>
              <div className="info-card-content">
                <p className="conclusion-text">
                  Sistem Informasi Pendataan Kualitas Rumah menjadi inovasi penting untuk mendukung program pemerintah dalam
                  menciptakan hunian layak bagi masyarakat. Dengan memanfaatkan teknologi modern, data yang dihasilkan lebih
                  akurat, efisien, dan dapat digunakan untuk pengambilan keputusan yang strategis.
                </p>
              </div>
            </motion.section>
          </div>

          {/* PDF List Section */}
          <motion.div 
            className="pdf-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="section-title">Dasar Hukum</h2>
            
            {isLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Memuat dokumen...</p>
              </div>
            ) : (
              <motion.div 
                className="pdf-cards-container"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                {pdfList.length > 0 ? (
                  pdfList.map((pdf) => (
                    <motion.div 
                      key={pdf.id} 
                      className="pdf-card"
                      variants={fadeInUp}
                    >
                      <div className="pdf-icon">
                        <FaFileAlt />
                      </div>
                      <div className="pdf-info">
                        <h3 className="pdf-filename">{pdf.filename}</h3>
                        <div className="pdf-actions">
                          <button onClick={() => handleView(pdf.path)} className="view-button">
                            Lihat
                          </button>
                          <button onClick={() => handleDownload(pdf.filename)} className="download-button">
                            <FaDownload /> Download
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="no-pdf-message">
                    <p>Tidak ada dokumen tersedia saat ini.</p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* PDF Viewer Section */}
        {selectedPdf && (
          <motion.div 
            id="pdf-viewer-section" 
            className="pdf-viewer-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="pdf-viewer-container">
              <div className="pdf-viewer-header">
                <h3 className="viewer-title">Preview Dokumen</h3>
                <button className="fullscreen-button">
                  <EnterFullScreen>
                    {(props) => (
                      <div onClick={props.onClick}>
                        <FaExpand /> Layar Penuh
                      </div>
                    )}
                  </EnterFullScreen>
                </button>
              </div>
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                <div className="viewer-container">
                  <div className="toolbar-container">
                    <Toolbar>{(props) => <>{props.slot}</>}</Toolbar>
                  </div>
                  <div className="viewer-content">
                    <div className="pdf-thumbnail">{thumbnailPluginInstance.Thumbnails()}</div>
                    <div className="pdf-document">
                      <Viewer
                        fileUrl={`${process.env.REACT_APP_URL}/${selectedPdf}`}
                        plugins={[
                          fullScreenPluginInstance,
                          thumbnailPluginInstance,
                          zoomPluginInstance,
                          toolbarPluginInstance,
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </Worker>
            </div>
          </motion.div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default InformasiDasarHukum;