import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  Avatar,
  Paper,
  useMediaQuery,
} from "@mui/material";
import { styled, useTheme } from "@mui/system";
import {
  BarChart2,
  Users,
  CheckCircle,
  XCircle,
  Archive,
  UserX,
} from "lucide-react";
import "@fontsource/plus-jakarta-sans";
import { Grafik } from "./Grafik";
import { GrafikDashboard } from "./GrafikDashboard";
// Styled components
const MainContent = styled(Box)(({ theme }) => ({
  background: "#f5f7fa",
  minHeight: "calc(100vh - 64px)",
  padding: "24px",
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  transition: "transform 0.3s, box-shadow 0.3s",
  overflow: "hidden",
  height: "100%",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  },
}));

const CardIconWrapper = styled(Avatar)(({ theme, bgcolor }) => ({
  backgroundColor: bgcolor || "#4338CA",
  width: 56,
  height: 56,
  borderRadius: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "20px",
}));

const StatValue = styled(Typography)(({ theme }) => ({
  fontSize: "32px",
  fontWeight: 700,
  marginBottom: "8px",
  fontFamily: "'Plus Jakarta Sans', sans-serif",
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  color: "#64748B",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  fontWeight: 600,
  fontFamily: "'Plus Jakarta Sans', sans-serif",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "20px",
  fontWeight: 700,
  marginBottom: "24px",
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  display: "flex",
  alignItems: "center",
  gap: "8px",
}));
const WelcomeCard = styled(Card)(({ theme }) => ({
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  marginBottom: "24px",
  padding: "24px",
  backgroundSize: "cover",
  backgroundPosition: "center",
  overflow: "hidden",
  position: "relative",
}));

const WelcomeContent = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 1,
}));

const WelcomeOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "linear-gradient(45deg, rgba(67, 56, 202, 0.7) 0%, rgba(79, 70, 229, 0.4) 100%)",
  zIndex: 0,
}));

export const Dashboard2 = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useSelector((state) => state.authAdmin || {});
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAll = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_URL}/all`, { withCredentials: true });
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    getAll();
  }, []);

  const statsCards = [
    {
      title: "Layak Huni",
      value: data?.totalLayakHuni || 0,
      icon: <CheckCircle size={24} color="#fff" />,
      color: "#4F46E5",
    },
    {
      title: "Tidak Layak Huni",
      value: data?.totalTidakLayakHuni || 0,
      icon: <XCircle size={24} color="#fff" />,
      color: "#F43F5E",
    },
    {
      title: "Berpenghuni",
      value: data?.totalBerpenghuni || 0,
      icon: <Users size={24} color="#fff" />,
      color: "#10B981",
    },
    {
      title: "Tidak Berpenghuni",
      value: data?.totalTidakBerpenghuni || 0,
      icon: <UserX size={24} color="#fff" />,
      color: "#FB923C",
    },
    {
      title: "Backlog",
      value: data?.totalBacklog || 0,
      icon: <Archive size={24} color="#fff" />,
      color: "#6366F1",
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Ubah Container pertama dari "lg" menjadi "xl" atau custom width */}
      <Container 
        maxWidth={false} 
        sx={{ 
          py: 0, 
          ml: { sm: "230px" },
          pr: { xs: 2, sm: 4 },
          width: { sm: "calc(100% - 210px)" } // Membuat Container menggunakan seluruh lebar yang tersedia
        }}
      >
        {/* Main Content */}
        {/* Hapus Container kedua atau sesuaikan maxWidth-nya */}
        <Box sx={{ py: 2 }}>
          {/* Welcome Card - Removed "Tambah Data Baru" button */}
          <WelcomeCard>
            <WelcomeOverlay />
            <WelcomeContent>
              <Typography variant="h5" sx={{ color: "white", fontWeight: 700, mb: 1, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Selamat Datang, {user?.username || "Admin"}!
              </Typography>
              <Typography variant="body2" sx={{ color: "white", opacity: 0.9, mb: 3, maxWidth: "600px" }}>
                Sistem Informasi Pendataan Kualitas Rumah (SI-DALIMAH) menyediakan informasi mengenai keadaan rumah di berbagai wilayah.
              </Typography>
              {/* Removed the "Tambah Data Baru" button from here */}
            </WelcomeContent>
          </WelcomeCard>
  
          {/* Stats Section */}
          <SectionTitle>
            <BarChart2 size={24} />
            Statistik Rumah
          </SectionTitle>
  
          <Grid container spacing={3}>
            {statsCards.map((card, index) => (
              <Grid item xs={12} sm={6} md={4} lg={card.title === "Backlog" ? 12 : 3} key={index}>
                <StyledCard>
                  <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
                    <CardIconWrapper bgcolor={card.color}>{card.icon}</CardIconWrapper>
                    <StatValue>{card.value}</StatValue>
                    <StatLabel>{card.title}</StatLabel>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
  
          {/* Chart Section */}
          <Box sx={{ mt: 4 }}>
            <SectionTitle>
              <BarChart2 size={24} />
              Grafik Perbandingan
            </SectionTitle>
          </Box>
        </Box>
        <GrafikDashboard />
      </Container>
    </Box>
  );
}