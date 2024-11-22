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
import { FaDownload, FaExpand } from "react-icons/fa";
import "./InformasiDasarHukum.css";
import Footer from "./Footer";

function InformasiDasarHukum() {
  const [pdfList, setPdfList] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);

  // Initialize plugins
  const fullScreenPluginInstance = fullScreenPlugin();
  const thumbnailPluginInstance = thumbnailPlugin();
  const zoomPluginInstance = zoomPlugin();
  const toolbarPluginInstance = toolbarPlugin();
  const { Toolbar } = toolbarPluginInstance;
  const { EnterFullScreen } = fullScreenPluginInstance;

  useEffect(() => {
    const fetchPdfList = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/pdf`, {
          withCredentials: true,
        });
        setPdfList(response.data.data);
      } catch (error) {
        console.error("Error fetching PDF list:", error);
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
  };

  return (
    <>
   
      <NavbarDasboard />
      <div>
        <div>
          <div>
      <div className="info-container">
        <h1 className="info-title">Sistem Informasi Pendataan Kualitas Rumah (SIDALIMAH)</h1>

        <section className="info-section">
          <h2 className="info-subtitle">Latar Belakang</h2>
          <p>
          Latar Belakang
          Pendataan kualitas rumah adalah bagian penting dari upaya pemerintahdaerah dalam menyediakan hunian yang layak bagi masyarakat. Kualitas rumah yang tidak memadai dapat berdampak negatif pada kesehatan, kenyamanan, dan keselamatan penghuninya.
          Di Kabupaten Sumbawa Barat, program pembangunan rumah layak huni dan perbaikan rumah tidak layak huni memerlukan data yang akurat dan dapat diandalkan. Pendataan secara manual sering menemui kendala, seperti:

          </p>
          <ul>
            <li>Kesalahan pencatatan akibat proses yang tidak terstandardisasi.</li>
            <li>Kurangnya koordinasi antara tim lapangan dan pengambil keputusan.</li>
            <li>Keterlambatan proses pengumpulan data, yang memperlambat pelaksanaan program bantuan.</li>
          </ul>
          <p>
            Untuk menjawab tantangan ini, Sistem Informasi Pendataan Kualitas Rumah (SIDALIMAH) dirancang sebagai solusi
            modern yang mengintegrasikan teknologi untuk meningkatkan akurasi, efisiensi, dan kemudahan akses data.
          </p>
        </section>

        <section className="info-section">
          <h2 className="info-subtitle">Tujuan Sistem</h2>
          <ul>
            <li>Meningkatkan efisiensi proses pendataan melalui digitalisasi.</li>
            <li>Memastikan keakuratan data sehingga program bantuan dapat tepat sasaran.</li>
            <li>Memberikan laporan dan analisis real-time kepada pemerintah daerah.</li>
            <li>
              Mempermudah pelacakan kondisi rumah di seluruh wilayah Kabupaten Sumbawa Barat.
            </li>
          </ul>
        </section>

        <section className="info-section">
          <h2 className="info-subtitle">Sasaran Program</h2>
          <ul>
          <strong>Pemerintah Daerah</strong>
            <li>Sebagai alat bantu dalam merumuskan kebijakan.</li><li>	Memberikan laporan berkala terkait jumlah dan kondisi rumah layak huni, rumah tidak layak huni, serta data backlog.</li>
            <strong>Surveyor Lapangan</strong>
            <li>Mempermudah pekerjaan surveyor dengan perangkat yang terintegrasi.</li><li>Mengurangi kesalahan pencatatan dengan sistem otomatis.</li>
            <strong>Masyarakat</strong>
            <li>Mendapatkan kepastian bahwa rumah mereka telah terdata dengan baik.</li><li>Mempercepat proses bantuan kepada masyarakat yang membutuhkan.</li>
            <strong>Program Bantuan Pemerintah</strong>
            <li>Mendukung program seperti bantuan renovasi rumah, pembangunan rumah layak huni, atau penanganan pascabencana.</li>
          </ul>
        </section>
        <section className="info-section">
        <h2 className="info-subtitle">Fitur Utama Sistem</h2>
        <ul>
          <strong>1. Dashboard</strong>
          <li>Menampilkan data rekapan hasil survei secara visual.</li>
          <li>Memberikan laporan berbasis kategori rumah layak dan tidak layak huni, serta data backlog.</li>
          <strong>2. Pendataan Digital di Lapangan</strong>
          <li>Formulir berbasis digital dengan 58 pertanyaan terkait kondisi rumah.</li>
          <li>Hasil survei otomatis tersimpan di database pusat</li>
          <strong>3. Analisis Otomatis Kelayakan Rumah</strong>
          <li>Sistem memberikan hasil "Layak Huni" atau "Tidak Layak Huni" berdasarkan skor.</li>
          <li>Menggunakan bobot nilai yang telah ditentukan (di bawah 45%: Rumah Layak Huni, di atas 45%: Rumah Tidak Layak Huni, Jumlah KK lebih lebih dari 1: Backlog).</li>
          <strong>4. Integrasi dengan Peta Lokasi</strong>
          <li>Menggunakan Google Maps untuk memetakan rumah yang telah disurvei.</li>
          <li>Mempermudah pelacakan lokasi fisik rumah.</li>
          <strong>5. Pengunduhan Laporan</strong>
          <li>Data survei dapat diunduh dalam format Excel untuk analisis lebih lanjut.</li>
        </ul>
        </section>
        <section className="info-section">
        <h2 className="info-subtitle">Langkah-Langkah Pelaksanaan</h2>
        <ul>
        <strong>1. Pelatihan Surveyor</strong>
        <li>Surveyor diberikan pelatihan teknis terkait cara penggunaan sistem, standar penilaian rumah, dan teknik komunikasi dengan masyarakat.</li>
        <strong>
         2. Penyebaran Surveyor
        </strong>
        <li>Tim surveyor diterjunkan ke lokasi sesuai zona tanggung jawab yang ditentukan.</li>
        <strong>3. Pengumpulan Data Digital</strong>
        <li>Data diinput menggunakan perangkat seperti tablet atau smartphone, kemudian disinkronisasi ke server pusat.</li>
        <strong>4. Pengolahan dan Analisis Data</strong>
        <li>Sistem secara otomatis menghitung kelayakan rumah berdasarkan kriteria bobot yang telah ditetapkan.</li>
        <strong>
        5. Pelaporan dan Tindak Lanjut
        </strong>
        <li>Data diproses oleh tim admin untuk diserahkan kepada pengambil kebijakan.</li>
        </ul>
          </section>
          <section className="info-section">
          <ul>
            <strong>Kompetensi Surveyor</strong>
            <p>Surveyor adalah bagian penting dari kesuksesan program ini. Mereka bertugas mengumpulkan data teknis di lapangan dan memastikan keabsahan informasi yang diberikan. Beberapa kriteria yang harus dimiliki oleh surveyor:</p>
            <li>1. <b>Lulusan minimal S-1 Teknik Sipil</b>, Arsitektur, atau bidang terkait dengan pemahaman mendalam tentang konstruksi bangunan</li>
            <li>2. <b>Memiliki sertifikasi atau pengalaman kerja</b> di bidang survei bangunan atau konstruksi.</li>
            <li>3. <b>Kompeten dalam menggunakan perangkat digital</b> untuk pengisian data dan koordinasi.</li>
            <li>4. <b>Mampu berkomunikasi dengan baik</b> untuk menjelaskan tujuan survei kepada masyarakat.</li>
            <li>5. <b>Memahami standar kelayakan rumah</b> yang telah ditetapkan pemerintah</li>
          </ul>
          </section>
        <section className="info-section">
          <h2 className="info-subtitle">Kesimpulan</h2>
          <p>
            Sistem Informasi Pendataan Kualitas Rumah menjadi inovasi penting untuk mendukung program pemerintah dalam
            menciptakan hunian layak bagi masyarakat. Dengan memanfaatkan teknologi modern, data yang dihasilkan lebih
            akurat, efisien, dan dapat digunakan untuk pengambilan keputusan yang strategis.
          </p>
        </section>
      </div>
      <div>
        {/* PDF List Section */}
        <div className="pdf-list">
          <h2 className="section-title">Dasar Hukum</h2>
          <div className="pdf-cards">
            {pdfList.map((pdf) => (
              <div key={pdf.id} className="pdf-card">
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
            ))}
          </div>

          {selectedPdf && (
            <div className="pdf-viewer">
              <div className="pdf-viewer-header">
                <h3 className="viewer-title">Preview PDF</h3>
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
                  <Toolbar>{(props) => <>{props.slot}</>}</Toolbar>
                  <div className="pdf-thumbnail">{thumbnailPluginInstance.Thumbnails()}</div>
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
              </Worker>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
    </div>

    <Footer />
    </>
  );
}

export default InformasiDasarHukum;
