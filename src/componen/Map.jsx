import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Konfigurasi icon marker default
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function Maps({ selectedItem }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_URL}/maps`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <MapContainer
      center={selectedItem ? selectedItem.titikKoordinatRumah.split(",").map(Number) : [-6.200000, 106.816666]}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {data.map((item) => {
        const coordinates = item.titikKoordinatRumah.split(",").map(Number);
        return (
          selectedItem && selectedItem.id === item.id && (
            <Marker key={item.id} position={coordinates}>
              <Popup>
                <div>
                  <p><strong>Nama:</strong> {item.namaLengkapKK}</p>
                  <p><strong>Alamat:</strong> {item.alamatRumah}</p>
                  <p><strong>Kecamatan:</strong> {item.kecamatan}</p>
                  <p><strong>Desa/Kelurahan:</strong> {item.desaKelurahan || "Tidak tersedia"}</p>
                  <p><strong>Koordinat:</strong> {item.titikKoordinatRumah}</p>
                </div>
              </Popup>
            </Marker>
          )
        );
      })}
    </MapContainer>
  );
}

export default Maps;
