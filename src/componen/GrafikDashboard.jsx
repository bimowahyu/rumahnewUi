import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./GrafikDashboard.css";

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

export const GrafikDashboard = () => {
  const navigate = useNavigate();
  const [backlogCounts, setBacklogCounts] = useState([]);
  const [statistics, setStatistics] = useState({
    totalRumahLayakHuni: 0,
    totalRumahTidakLayakHuni: 0,
    totalRumahBerpenghuni: 0,
    totalRumahTidakBerpenghuni: 0,
    byKecamatan: {},
    totalBacklog: 0,
  });
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  
  // References to chart containers for resizing
  const chartContainerRef1 = useRef(null);
  const chartContainerRef2 = useRef(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Determine appropriate font and spacing sizes based on screen width
  const getFontSize = (baseSize) => {
    if (windowSize.width < 480) return baseSize * 0.6;
    if (windowSize.width < 768) return baseSize * 0.8;
    return baseSize;
  };

  // Always use the complete dataset for both mobile and desktop
  const getFullDatasets = () => {
    return [
      {
        label: "Rumah Layak Huni",
        data: Object.keys(statistics.byKecamatan || {}).map(kecamatan => statistics.byKecamatan[kecamatan].rumahLayakHuni),
        backgroundColor: "rgba(75, 192, 192, 0.8)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Rumah Tidak Layak Huni",
        data: Object.keys(statistics.byKecamatan || {}).map(kecamatan => statistics.byKecamatan[kecamatan].rumahTidakLayakHuni),
        backgroundColor: "rgba(255, 99, 132, 0.8)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Berpenghuni",
        data: Object.keys(statistics.byKecamatan || {}).map(kecamatan => statistics.byKecamatan[kecamatan].rumahBerpenghuni),
        backgroundColor: "rgba(54, 162, 235, 0.8)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Tidak Berpenghuni",
        data: Object.keys(statistics.byKecamatan || {}).map(kecamatan => statistics.byKecamatan[kecamatan].rumahTidakBerpenghuni),
        backgroundColor: "rgba(255, 206, 86, 0.8)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
      },
      {
        label: "Total Backlog",
        data: Object.keys(statistics.byKecamatan || {}).map(kecamatan => {
          const backlog = backlogCounts.find(item => item.kecamatan === kecamatan);
          return backlog ? backlog.count : 0;
        }),
        backgroundColor: "rgba(153, 102, 255, 0.8)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      }
    ];
  };

  const dataCombined = {
    labels: Object.keys(statistics.byKecamatan || {}),
    datasets: getFullDatasets()
  };

  // Configuration for optimized chart display
  const getChartOptions = (title, isTotalChart = false) => {
    const baseFontSize = getFontSize(14);
    const titleFontSize = getFontSize(16);
    const labelFontSize = getFontSize(12);
    
    const isSmallScreen = windowSize.width < 768;
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: isSmallScreen ? "bottom" : "top",
          labels: {
            boxWidth: isSmallScreen ? 10 : 20,
            padding: isSmallScreen ? 5 : 10,
            font: { size: baseFontSize }
          }
        },
        title: {
          display: true,
          text: title,
          font: { size: titleFontSize, weight: 'bold' },
          padding: { top: 10, bottom: 15 }
        },
        datalabels: {
          display: isTotalChart || !isSmallScreen, // Only show labels on total chart on mobile
          anchor: 'end',
          align: 'top',
          font: { size: labelFontSize },
          color: '#444',
          formatter: (value) => value > 0 ? value : '',
        },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          padding: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          titleFont: { size: baseFontSize },
          bodyFont: { size: baseFontSize },
          displayColors: true,
          callbacks: {
            title: (tooltipItems) => {
              return isTotalChart ? "Total Statistik" : `Kecamatan ${tooltipItems[0].label}`;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: { 
            font: { size: labelFontSize },
            maxRotation: isSmallScreen ? 90 : 45,
            minRotation: isSmallScreen ? 90 : 45,
          },
          grid: {
            display: false
          }
        },
        y: {
          ticks: { 
            font: { size: labelFontSize },
            callback: function(value) {
              // For smaller numbers, show the full value
              // For larger numbers, simplify to K format on mobile
              if (isSmallScreen && value >= 1000) {
                return (value / 1000).toFixed(1) + 'K';
              }
              return value;
            }
          },
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        }
      },
      layout: {
        padding: {
          top: isSmallScreen ? 10 : 20
        }
      },
      animation: {
        duration: isSmallScreen ? 500 : 1000 // Faster animations on mobile
      }
    };
  };

  // Use the full dataset for totals as well
  const getFullTotalsDatasets = () => {
    return [
      {
        label: "Rumah Layak Huni",
        data: [statistics.totalRumahLayakHuni],
        backgroundColor: "rgba(75, 192, 192, 0.8)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Rumah Tidak Layak Huni",
        data: [statistics.totalRumahTidakLayakHuni],
        backgroundColor: "rgba(255, 99, 132, 0.8)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Berpenghuni",
        data: [statistics.totalRumahBerpenghuni],
        backgroundColor: "rgba(54, 162, 235, 0.8)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Tidak Berpenghuni",
        data: [statistics.totalRumahTidakBerpenghuni],
        backgroundColor: "rgba(255, 206, 86, 0.8)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
      },
      {
        label: "Total Backlog",
        data: [statistics.totalBacklog],
        backgroundColor: "rgba(153, 102, 255, 0.8)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ];
  };

  // For total stats - using full dataset for all screen sizes
  const combinedTotals = {
    labels: ["Statistik Total"],
    datasets: getFullTotalsDatasets()
  };

  return (
    <div className="dashboard2">
      <main className="charts">
        {/* Chart 1: Per Kecamatan Stats */}
        <div 
          className="chart-container" 
          ref={chartContainerRef1}
          style={{ display: 'block' }}
        >
          <Bar 
            data={dataCombined} 
            options={getChartOptions('Statistik Perumahan Per Kecamatan')} 
            height={windowSize.width < 768 ? 500 : 350} // Increased height for mobile to fit all labels
          />
        </div>
        
        {/* Chart 2: Total Stats */}
        <div 
          className="chart-container" 
          ref={chartContainerRef2}
          style={{ display: 'block' }}
        >
          <Bar 
            data={combinedTotals} 
            options={getChartOptions('Statistik Total Perumahan', true)} 
            height={windowSize.width < 768 ? 450 : 350}
          />
        </div>
      </main>
    </div>
  );
};