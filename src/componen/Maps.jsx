import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MyNavbar from "../map/Navbar";
import "./Maps.css"
import axios from "axios";

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
const getCustomIcon = (color) => {
    const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="36" height="36">
      <path fill="${color}" stroke="#000" strokeWidth="1" d="M12 0C7.6 0 3.6 3.9 3.6 8.7c0 2.4 1 4.6 2.5 6.5L12 24l5.9-8.8c1.5-1.9 2.5-4.1 2.5-6.5C20.4 3.9 16.4 0 12 0zm0 12c-1.9 0-3.4-1.5-3.4-3.3s1.5-3.3 3.4-3.3 3.4 1.5 3.4 3.3S13.9 12 12 12z"/>
    </svg>`;
  
    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: svgIcon,
      iconSize: [36, 36],
      iconAnchor: [18, 36], // Anchor the bottom of the marker
      popupAnchor: [0, -34], // Position popup above the marker
    });
  };

function Maps({ selectedItem }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_URL}/maps`, {
            withCredentials: true,
          });
          console.log("Fetched data:", response.data);
          setData(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    fetchData();
  }, []);

  // Helper function to safely get coordinates
//   const getCoordinates = (item) => {
//     const koordinat = item.titikKoordinatRumah || item.manualTitikKoordinatRumah;
//     if (koordinat && koordinat !== "-" && koordinat.trim() !== "") {
//       return koordinat.split(",").map(Number);
//     }
//     return null; // Return null if no valid coordinates
//   };
const getCoordinates = (item) => {
    const koordinat = item.titikKoordinatRumah || item.manualTitikKoordinatRumah;
    if (koordinat && koordinat !== "-" && koordinat.trim() !== "") {
      const [lat, lng] = koordinat.split(",").map(Number);
      if (!isNaN(lat) && !isNaN(lng)) { // Validate numeric values
        return [lat, lng];
      }
    }
    return null; // Return null if coordinates are invalid
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
                <p><strong>Surveyor:</strong> {item.Admin?.username || "Tidak diketahui"}</p>
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