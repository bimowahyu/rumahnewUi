import React, { useState, useEffect } from "react";
import { NavbarDasboard } from "../map/NavbarDasboard";
import { pdfjs, Document, Page } from "react-pdf";
import axios from "axios";


// Atur workerSrc dari pdfjs menggunakan path dari folder public
pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

function InformasiDasarHukum() {
  const [pdfList, setPdfList] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);

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

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div>
      <NavbarDasboard />
      <h1>Informasi dan Dasar Hukum</h1>
      <p>Halaman ini akan menampilkan informasi dan dasar hukum terkait.</p>

      {/* Daftar PDF */}
      <div>
        <h2>Daftar PDF</h2>
        <ul>
          {pdfList.map((pdf) => (
            <li key={pdf.id}>
              <button onClick={() => setSelectedPdf(pdf.path)}>
                {pdf.filename}
              </button>
              <button onClick={() => handleDownload(pdf.filename)}>
                Download
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Tampilkan halaman PDF yang dipilih */}
      {selectedPdf && (
        <div>
          <h3>Preview PDF</h3>
          <Document
            file={`${process.env.REACT_APP_URL}/${selectedPdf}`}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => console.error("Error loading PDF:", error)}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={index + 1} pageNumber={index + 1} />
            ))}
          </Document>
        </div>
      )}
    </div>
  );
}

export default InformasiDasarHukum;
