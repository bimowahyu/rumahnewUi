import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// Set custom icon for markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function PetaPerumahan() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_URL}/maps`);
        if (!response.ok) throw new Error("Error fetching data");
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError("Gagal mengambil data peta. Silakan coba lagi nanti.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Container fluid className="p-4">
      <Row className="justify-content-center mb-4">
        <Col md="auto">
          <h2 className="text-center">Peta Perumahan</h2>
          <p className="text-muted text-center">Menampilkan lokasi perumahan pada peta interaktif.</p>
        </Col>
      </Row>

      {loading && (
        <Row className="justify-content-center">
          <Spinner animation="border" variant="primary" />
          <p className="text-center">Memuat data peta...</p>
        </Row>
      )}

      {error && (
        <Row className="justify-content-center">
          <Col md="auto">
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <MapContainer
            center={[-7.3126267, 115.2469651]}
            zoom={5}
            style={{ height: "500px", width: "100%", borderRadius: "10px" }}
            className="shadow-sm"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />

            {data.map((item) => {
              const coordinates =
                item.titikKoordinatRumah !== "-" && item.titikKoordinatRumah
                  ? item.titikKoordinatRumah.split(",").map(Number)
                  : item.manualTitikKoordinatRumah.split(",").map(Number);

              if (
                coordinates.length === 2 &&
                !isNaN(coordinates[0]) &&
                !isNaN(coordinates[1])
              ) {
                return (
                  <Marker key={item.id} position={coordinates}>
                    <Popup>
                      <strong>{item.namaLengkapKK}</strong><br />
                      <p>{item.alamatRumah || "Alamat tidak tersedia"}</p>
                      <p>{item.kecamatan || "Kecamatan tidak tersedia"}</p>
                    </Popup>
                  </Marker>
                );
              }
              return null;
            })}
          </MapContainer>
        </Col>
      </Row>
    </Container>
  );
}

export default PetaPerumahan;
