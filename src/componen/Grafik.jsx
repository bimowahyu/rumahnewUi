import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import "./Grafik.css"

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ChartDataLabels);
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const Grafik = () => {
    const navigate = useNavigate();
  // const [username, setUsername] = useState("");
  const [backlogCounts, setBacklogCounts] = useState([]);
  const [statistics, setStatistics] = useState({
    totalRumahLayakHuni: 0,
    totalRumahTidakLayakHuni: 0,
    totalRumahBerpenghuni: 0,
    totalRumahTidakBerpenghuni: 0,
    byKecamatan: {},
    totalBacklog: 0,
  });
  useEffect(() => {
    const fetchRekapData = async () => {
      try {
        const responseFilter = await axios.get(`${process.env.REACT_APP_URL}/filter`, { withCredentials: true });
        const responseBacklog = await axios.get(`${process.env.REACT_APP_URL}/backlog`, { withCredentials: true });
        const responseAll = await axios.get(`${process.env.REACT_APP_URL}/all`, { withCredentials: true });

        if (responseFilter.status === 200 && responseBacklog.status === 200 && responseAll.status === 200) {
          // Hitung statistik per kecamatan
          const combinedData = [...responseFilter.data.layakHuni, ...responseFilter.data.tidakLayakHuni];
          const byKecamatan = calculateStatistics(combinedData);

          const backlogCountsData = responseBacklog.data.data.map((item) => {
            const match = item.match(/Kecamatan (.+?) = (\d+) Kk/);
            if (match) {
              return { kecamatan: match[1], count: parseInt(match[2], 10) };
            }
            return null;
          }).filter(Boolean);

          const totalBacklog = backlogCountsData.reduce((sum, item) => sum + item.count, 0);

          // Data dari API /all untuk total keseluruhan
          const allData = responseAll.data.data;
          setStatistics({
            ...byKecamatan,
            totalBacklog,
            totalRumahLayakHuni: allData.totalLayakHuni,
            totalRumahTidakLayakHuni: allData.totalTidakLayakHuni,
            totalRumahBerpenghuni: allData.totalBerpenghuni,
            totalRumahTidakBerpenghuni: allData.totalTidakBerpenghuni,
          });

          setBacklogCounts(backlogCountsData);
        } else {
          console.error("Error fetching data:", responseFilter.statusText, responseBacklog.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchRekapData();
  }, [navigate]);
  const calculateStatistics = (combinedData) => {
    const byKecamatan = {};
    combinedData.forEach(item => {
      const { kecamatan, kategori, statusrumah } = item;
      if (!byKecamatan[kecamatan]) {
        byKecamatan[kecamatan] = {
          rumahLayakHuni: 0,
          rumahTidakLayakHuni: 0,
          rumahBerpenghuni: 0,
          rumahTidakBerpenghuni: 0,
        };
      }
      if (kategori === "Rumah Layak Huni") {
        byKecamatan[kecamatan].rumahLayakHuni += 1;
      } else if (kategori === "Rumah Tidak Layak Huni") {
        byKecamatan[kecamatan].rumahTidakLayakHuni += 1;
      }

      if (statusrumah === "Berpenghuni") {
        byKecamatan[kecamatan].rumahBerpenghuni += 1;
      } else if (statusrumah === "Tidak Berpenghuni") {
        byKecamatan[kecamatan].rumahTidakBerpenghuni += 1;
      }
    });
    return { byKecamatan };
  };

  const dataCombined = {
    labels: Object.keys(statistics.byKecamatan || {}),
    datasets: [
      {
        label: "Rumah Layak Huni",
        data: Object.keys(statistics.byKecamatan || {}).map(kecamatan => statistics.byKecamatan[kecamatan].rumahLayakHuni),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Rumah Tidak Layak Huni",
        data: Object.keys(statistics.byKecamatan || {}).map(kecamatan => statistics.byKecamatan[kecamatan].rumahTidakLayakHuni),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
      {
        label: "Berpenghuni",
        data: Object.keys(statistics.byKecamatan || {}).map(kecamatan => statistics.byKecamatan[kecamatan].rumahBerpenghuni),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Tidak Berpenghuni",
        data: Object.keys(statistics.byKecamatan || {}).map(kecamatan => statistics.byKecamatan[kecamatan].rumahTidakBerpenghuni),
        backgroundColor: "rgba(255, 206, 86, 0.6)",
      },
      {
        label: "Total Backlog",
        data: Object.keys(statistics.byKecamatan || {}).map(kecamatan => {
          const backlog = backlogCounts.find(item => item.kecamatan === kecamatan);
          return backlog ? backlog.count : 0;
        }),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  const optionsCombined = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: window.innerWidth < 768 ? 10 : 14 }, // Ukuran font kecil di layar mobile
        },
      },
      title: {
        display: true,
        text: "Statistik Rumah dan Backlog per Kecamatan",
        font: { size: window.innerWidth < 768 ? 16 : 20 }, // Ukuran font judul lebih kecil di mobile
      },
      datalabels: {
        anchor: 'end',
        align: 'top',
        font: { size: window.innerWidth < 768 ? 8 : 12 },
        color: '#444',
      },
    },
    scales: {
      x: {
        ticks: { font: { size: window.innerWidth < 768 ? 8 : 12 } },
      },
      y: {
        ticks: { font: { size: window.innerWidth < 768 ? 8 : 12 } },
        beginAtZero: true,
      },
    },
    maintainAspectRatio: false,
  };
  // Data untuk statistik total
  const combined = {
    labels: ["Total"],
    datasets: [
      {
        label: "Rumah Layak Huni",
        data: [statistics.totalRumahLayakHuni],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Rumah Tidak Layak Huni",
        data: [statistics.totalRumahTidakLayakHuni],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
      {
        label: "Berpenghuni",
        data: [statistics.totalRumahBerpenghuni],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Tidak Berpenghuni",
        data: [statistics.totalRumahTidakBerpenghuni],
        backgroundColor: "rgba(255, 206, 86, 0.6)",
      },
      {
        label: "Total Backlog",
        data: [statistics.totalBacklog],
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  const options2 = {
    ...optionsCombined, // Reuse the same options with minor differences
    plugins: {
      ...optionsCombined.plugins,
      title: { display: true, text: "Total Statistik Rumah dan Backlog" },
    },
  };
  return (
    <div className="dashboard2">
    <header>
      {/* Header if needed */}
    </header>
    <main className="charts">
      <div className="chart-container">
        <Bar data={dataCombined} options={optionsCombined} />
      </div>
      <div className="chart-container">
        <Bar data={combined} options={options2} />
      </div>
    </main>
  </div>
  
  )
}
