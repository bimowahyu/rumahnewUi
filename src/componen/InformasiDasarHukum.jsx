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
    <div>
      <NavbarDasboard />
      <div className="container">
        {/* PDF List Section */}
        <div className="pdf-list">
          <h2 className="section-title">Informasi Dan Dasar Hukum</h2>
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
  );
}

export default InformasiDasarHukum;
