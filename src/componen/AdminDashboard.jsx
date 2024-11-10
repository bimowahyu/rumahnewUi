import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardWidget from "./DashboardWidget";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import './SurveyorDashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminDashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [statistics, setStatistics] = useState({
    totalRumahLayakHuni: 0,
    totalRumahTidakLayakHuni: 0,
    totalRumahBerpenghuni: 0,
    totalRumahTidakBerpenghuni: 0,
    byKecamatan: {},
  });
  const [statusRumahData, setStatusRumahData] = useState({});
  const [statusRumah, setStatusRumah] = useState({});

  useEffect(() => {
    const fetchRekapData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/filter`, { withCredentials: true });
        if (response.status === 200) {
          const combinedData = [...response.data.layakHuni, ...response.data.tidakLayakHuni];
          const calculatedStatistics = calculateStatistics(combinedData);
          setStatistics(calculatedStatistics);
        } else {
          console.error("Error fetching rekap data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching rekap data:", error);
      }
    };
    fetchRekapData();
  }, [navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/me`, { withCredentials: true });
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

  useEffect(() => {
    const fetchStatusRumah = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/statusrumah`, { withCredentials: true });
        if (response.status === 200 && response.data.status === "success") {
          setStatusRumahData(response.data.data);
        } else {
          console.error("Error fetching status rumah data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching status rumah data:", error);
      }
    };
    fetchStatusRumah();
  }, []);

  useEffect(() => {
    const fetchStatusByKecamatan = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/statusrumah2`, { withCredentials: true });
        if (response.status === 200 && response.data.status === "success") {
          setStatusRumah(response.data.data);
        } else {
          console.error("Error fetching status rumah by kecamatan:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching status rumah by kecamatan:", error);
      }
    };
    fetchStatusByKecamatan();
  }, []);

  const calculateStatistics = (data) => {
    const stats = {
      totalRumahLayakHuni: 0,
      totalRumahTidakLayakHuni: 0,
      totalRumahBerpenghuni: 0,
      totalRumahTidakBerpenghuni: 0,
      byKecamatan: {},
    };

    data.forEach((item) => {
      if (item.kategori === "Rumah Layak Huni") {
        stats.totalRumahLayakHuni += 1;
      } else if (item.kategori === "Rumah Tidak Layak Huni") {
        stats.totalRumahTidakLayakHuni += 1;
      }
      if (item.statusrumah === "Berpenghuni") {
        stats.totalRumahBerpenghuni += 1;
      } else if (item.statusrumah === "Tidak Berpenghuni") {
        stats.totalRumahTidakBerpenghuni += 1;
      }
      if (!stats.byKecamatan[item.kecamatan]) {
        stats.byKecamatan[item.kecamatan] = {
          rumahLayakHuni: 0,
          rumahTidakLayakHuni: 0,
          rumahBerpenghuni: 0,
          rumahTidakBerpenghuni: 0,
        };
      }
      if (item.kategori === "Rumah Layak Huni") {
        stats.byKecamatan[item.kecamatan].rumahLayakHuni += 1;
      } else if (item.kategori === "Rumah Tidak Layak Huni") {
        stats.byKecamatan[item.kecamatan].rumahTidakLayakHuni += 1;
      }
      if (item.statusrumah === "Berpenghuni") {
        stats.byKecamatan[item.kecamatan].rumahBerpenghuni += 1;
      } else if (item.statusrumah === "Tidak Berpenghuni") {
        stats.byKecamatan[item.kecamatan].rumahTidakBerpenghuni += 1;
      }
    });
    return stats;
  };

  const dataKategori = {
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

  const dataStatus = {
    labels: Object.keys(statusRumah),
    datasets: [
      {
        label: "Berpenghuni",
        data: Object.keys(statusRumah).map((kecamatan) => statusRumah[kecamatan]?.Berpenghuni || 0),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Tidak Berpenghuni",
        data: Object.keys(statusRumah).map((kecamatan) => statusRumah[kecamatan]?.TidakBerpenghuni || 0),
        backgroundColor: "rgba(255, 206, 86, 0.6)",
      },
    ],
  };

  const dataOverallStatus = {
    labels: ["Berpenghuni", "Tidak Berpenghuni"],
    datasets: [
      {
        label: "Status Rumah",
        data: [statusRumahData.Berpenghuni, statusRumahData.TidakBerpenghuni],
        backgroundColor: ["rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Statistik Rumah",
      },
    },
  };

  const handleLogout = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_URL}/logout`, { withCredentials: true });
      sessionStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  return (
    <div className="dashboard">
      <header>
        <h2>Welcome, {username}</h2>
      </header>
      <main>
        <h2>Dashboard</h2>
        <div className="dashboard-widgets">
          <DashboardWidget title="Statistik Kategori Rumah per Kecamatan" content={<Bar data={dataKategori} options={options} />} />
          <DashboardWidget title="Statistik Status Rumah per Kecamatan" content={<Bar data={dataStatus} options={options} />} />
          <DashboardWidget title="Statistik Status Rumah Keseluruhan" content={<Bar data={dataOverallStatus} options={options} />} />
          <DashboardWidget
            title="Tindakan Cepat"
            content={
              <div className="quick-actions">
                <button onClick={() => navigate("/recap")}>Rekapitulasi</button>
                <button onClick={() => navigate("/questionnaire")}>Input Data</button>
                <button className="btn-logout" onClick={handleLogout}>
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
