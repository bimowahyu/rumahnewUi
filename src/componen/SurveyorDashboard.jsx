import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardWidget from "./DashboardWidget";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import "./SurveyorDashboard.css";

// Registrasi komponen Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function SurveyorDashboard() {
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
        const response = await axios.get(`${process.env.REACT_APP_URL}/filter`, {
          withCredentials: true
        });
  
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
        const response = await axios.get(`${process.env.REACT_APP_URL}/me`, {
          withCredentials: true
        });
  
        if (response.status === 200) {
          setUsername(response.data.username);
        } else {
          // Jika status bukan 200, berarti sesi telah habis, maka redirect ke login
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Jika terjadi error (misalnya session expired), redirect ke login
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
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
                <button
                  color="danger"
                  className="btn-logout"
                  onClick={async () => {
                    try {
                      
                      await axios.delete(`${process.env.REACT_APP_URL}/logout`,{ withCredentials: true });
                      sessionStorage.clear(); 
                      navigate("/login");
                    } catch (error) {
                      console.error("Error during logout", error);
                    }
                  }}
                >
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

export default SurveyorDashboard;
