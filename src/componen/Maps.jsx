import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MyNavbar from "../map/Navbar";
import "./Maps.css"

// Set default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Kecamatan dan Desa
const kecamatanDesa = {
  Taliwang: [
    "Menala", "Dalam", "Sampir", "Kuang", "Bugis", "Arab Kenangan", "Telaga Bertong",
    "Tamekan", "Seloto", "Lamunga", "Batu Putih", "Banjar", "Sermong", "Labuhan Kertasari",
    "Labuhan Lalar", "Lalar Liang",
  ],
  Seteluk: [
    "Seteluk Tengah", "Seteluk Atas", "Seran", "Rempe", "Tapir", "Air Suning", "Kelanir",
    "Lamusung", "Desa Loka", "Meraran",
  ],
  PotoTano: [
    "Poto Tano", "Kokarlian", "Tambak Sari", "Tebo", "Senayan", "Kiantar", "Tuananga", "Mantar",
  ],
  BrangRea: [
    "Lamuntet", "Rarak Ronges", "Bangkat Monteh", "Moteng", "Tepas Sepakat", "Tepas",
    "Sapugara Bree", "Seminar Salit", "Desa Beru",
  ],
  BrangEne: ["Lampok", "Mujahidin", "Kalimantong", "Manemeng", "Mataiyang", "Mura"],
  Jereweh: ["Dasan Anyar", "Goa", "Beru", "Belo"],
  Maluk: ["Benete", "Bukit Damai", "Mantun", "Pasir Putih", "Maluk"],
  Sekongkang: [
    "Talonang Baru", "Tatar", "Ai Kangkung", "Sekongkang Atas", "Tongo", "Kemuning", "Sekongkang Bawah",
  ],
};

// Generate unique colors for each desa
const generateMarkerColors = (kecamatanDesa) => {
  const colors = [
    "blue", "green", "red", "orange", "purple", "yellow", "pink", "cyan", "lime",
    "brown", "black", "teal", "indigo", "gold", "magenta",
  ];
  const markerColors = {};
  let colorIndex = 0;

  Object.values(kecamatanDesa).flat().forEach((desa) => {
    markerColors[desa] = colors[colorIndex % colors.length];
    colorIndex += 1;
  });

  return markerColors;
};

const markerColors = generateMarkerColors(kecamatanDesa);

// Function to create custom icon based on color
const getCustomIcon = (color) =>
  L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
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

  // Helper function to safely get coordinates
  const getCoordinates = (item) => {
    const koordinat = item.titikKoordinatRumah || item.manualTitikKoordinatRumah;
    if (koordinat && koordinat !== "-" && koordinat.trim() !== "") {
      return koordinat.split(",").map(Number);
    }
    return null; // Return null if no valid coordinates
  };

  return (
    <>
    <MyNavbar />
   
       
    <MapContainer
      center={[-8.7059, 116.8455]} // Default center: Sumbawa Barat
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {data.map((item) => {
        const coordinates = getCoordinates(item);
        if (!coordinates) return null; 

        const markerColor = markerColors[item.desaKelurahan] || "gray"; 

        return (
          <Marker key={item.id} position={coordinates} icon={getCustomIcon(markerColor)}>
            <Popup>
              <div>
                <p><strong>Nama:</strong> {item.namaLengkapKK}</p>
                <p><strong>Alamat:</strong> {item.alamatRumah}</p>
                <p><strong>Kecamatan:</strong> {item.kecamatan}</p>
                <p><strong>Desa/Kelurahan:</strong> {item.desaKelurahan || "Tidak tersedia"}</p>
                <p><strong>Koordinat:</strong> {item.titikKoordinatRumah || item.manualTitikKoordinatRumah}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
    </>
  );
}

export default Maps;
