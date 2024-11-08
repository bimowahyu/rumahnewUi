import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardWidget from "./DashboardWidget";
import axios from "../api";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import './SurveyorDashboard.css';
// import MyNavbar from "../map/Navbar";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminDashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [statistics, setStatistics] = useState({
    totalRumahLayakHuni: 0,
    totalRumahTidakLayakHuni: 0,
    byKecamatan: {},
  });

  useEffect(() => {
    const fetchRekapData = async () => {
      try {
        const response = await axios.get('/filter');
        if (response.status === 200) {
          const combinedData = [...response.data.layakHuni, ...response.data.tidakLayakHuni];
          const calculatedStatistics = calculateStatistics(combinedData);
          setStatistics(calculatedStatistics);
        } else {
          console.error("Error fetching rekap data:", response.statusText);
          alert("Terjadi masalah saat mengambil data rekap. Silakan coba lagi.");
        }
      } catch (error) {
        console.error("Error fetching rekap data:", error);
        alert("Terjadi kesalahan jaringan atau server. Silakan coba lagi nanti.");
      }
    };

    fetchRekapData();
  }, [navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/me');
        if (response.status === 200) {
          setUsername(response.data.username);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const calculateStatistics = (data) => {
    const stats = {
      totalRumahLayakHuni: 0,
      totalRumahTidakLayakHuni: 0,
      byKecamatan: {},
    };

    data.forEach((item) => {
      if (item.kategori === "Rumah Layak Huni") {
        stats.totalRumahLayakHuni += 1;
      } else if (item.kategori === "Rumah Tidak Layak Huni") {
        stats.totalRumahTidakLayakHuni += 1;
      }

      if (!stats.byKecamatan[item.kecamatan]) {
        stats.byKecamatan[item.kecamatan] = {
          rumahLayakHuni: 0,
          rumahTidakLayakHuni: 0,
        };
      }

      if (item.kategori === "Rumah Layak Huni") {
        stats.byKecamatan[item.kecamatan].rumahLayakHuni += 1;
      } else if (item.kategori === "Rumah Tidak Layak Huni") {
        stats.byKecamatan[item.kecamatan].rumahTidakLayakHuni += 1;
      }
    });

    return stats;
  };

  const handleLogout = async () => {
    try {
      await axios.delete('/logout');
      sessionStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  const data = {
    labels: Object.keys(statistics.byKecamatan),
    datasets: [
      {
        label: "Rumah Layak Huni",
        data: Object.keys(statistics.byKecamatan).map((kecamatan) => statistics.byKecamatan[kecamatan].rumahLayakHuni),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Rumah Tidak Layak Huni",
        data: Object.keys(statistics.byKecamatan).map((kecamatan) => statistics.byKecamatan[kecamatan].rumahTidakLayakHuni),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Statistik Kategori Rumah",
      },
    },
  };

  return (
    <div className="dashboard">
      <header>
        <h2>Welcome, {username}</h2>
      </header>
      <main>
        <h2>Dashboard</h2>
        <div className="dashboard-widgets">
          <DashboardWidget title="Statistik Rumah" content={<Bar data={data} options={options} />} />
          <DashboardWidget
            title="Tindakan Cepat"
            content={
              <div className="quick-actions">
                <button onClick={() => navigate("/recap")}>Rekapitulasi</button>
                <button onClick={() => navigate("/questionnaire")}>Input Data</button>
                <button color="danger" className="btn-logout" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            }
          />
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
