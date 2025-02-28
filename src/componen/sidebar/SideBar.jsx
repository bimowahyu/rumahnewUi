import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useDispatch, useSelector } from "react-redux";
import { LogoutOutlined } from "@mui/icons-material";
import { LogOutAdmin, reset, getMeAdmin } from "../../fitur/AuthSlice";

export const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const auth = useSelector((state) => state.authAdmin || {});
  const user = auth.user || null;

  const [adminMenuActive, setAdminMenuActive] = useState(() => {
    return localStorage.getItem("adminMenuActive") === "true";
  });

  const toggleAdminMenu = () => {
    setAdminMenuActive((prev) => {
      const newState = !prev;
      localStorage.setItem("adminMenuActive", newState);
      return newState;
    });
  };

  useEffect(() => {
    dispatch(getMeAdmin());
  }, [dispatch]);

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleLogoutClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenConfirmDialog(true);
  };

  const handleConfirmLogout = () => {
    dispatch(LogOutAdmin());
    dispatch(reset());
    navigate("/");
    setOpenConfirmDialog(false);
  };

  const handleCancelLogout = () => {
    setOpenConfirmDialog(false);
  };

  const navLinkStyle = {
    textDecoration: "none",
    color: "#cbd5e1",
    padding: "12px",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    display: "block",
    "&:hover": {
      backgroundColor: "#B1F0F7",
      color: "white",
      transform: "translateX(8px)",
    },
    "&.active": {
      backgroundColor: "#B1F0F7",
      color: "white",
      boxShadow: "0 4px 6px rgba(177, 240, 247, 0.2)",
    },
  };

  return (
    <Box
      sx={{
        bgcolor: "#0A5EB0",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: { xs: 200, lg: 250 },
        position: "fixed",
        top: 0,
        left: 0,
        p: 2,
        zIndex: 1200,
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#B1F0F7",
          borderRadius: "10px",
          "&:hover": {
            backgroundColor: "#90E0E7",
          },
        },
      }}
    >
      {/* Logo Section */}
     {/* Logo Section with Animation */}
<Box
  sx={{
    display: "flex",
    flexDirection: "column", // Mengatur agar elemen dalam box berurutan ke bawah
    alignItems: "center",
    justifyContent: "center",
    height: "auto", // Menyesuaikan tinggi berdasarkan konten
    mb: 3,
    borderBottom: "1px solid rgb(46, 125, 251)",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
  }}
>
  <img
    src="/images/logobaru.png"
    alt="Logo Aplikasi"
    className="homelogo"
    style={{
      width: "80px", // Atur ukuran sesuai kebutuhan
      height: "80px",
      marginBottom: "10px", // Memberikan jarak antara logo dan teks
    }}
  />
  
  <Typography
    variant="body1"
    sx={{
      textAlign: "center", // Agar teks tetap berada di tengah
      color: "#fff", // Sesuaikan warna agar kontras dengan background
      fontWeight: "bold",
      fontSize: "14px", // Sesuaikan ukuran font
      lineHeight: "1.4", // Menjaga agar teks tidak terlalu rapat
    }}
  >
    Sistem Informasi Pendataan <br />
    Kualitas Rumah
  </Typography>
</Box>


      {/* Navigation Links */}
      <Stack spacing={2} sx={{ flex: 1 }}>
        {[
          { to: "/admin/dashboard", text: "Dashboard" },
          { to: "/recap", text: "Rekapitulasi" },
          { to: "/questionnaire", text: "Tambah Data" },
          ...(adminMenuActive ? [{ to: "/upload", text: "Upload Foto Manual" }] : [])
        ].map((item) => (
          <Typography component={NavLink} to={item.to} sx={navLinkStyle} key={item.to}>
            {item.text}
          </Typography>
        ))}

        {user?.role === "admin" && (
          <Button variant="contained" color="secondary" onClick={toggleAdminMenu}>
            {adminMenuActive ? "Nonaktifkan Menu Upload Foto" : "Aktifkan Menu Upload Foto"}
          </Button>
        )}

        {/* Menu Khusus Admin */}
        {user?.role === "admin" && (
          <>
            <Typography component={NavLink} to="/register" sx={navLinkStyle}>
              Register
            </Typography>
            <Typography component={NavLink} to="/uploadpdf" sx={navLinkStyle}>
              Upload Pdf
            </Typography>
            <Typography component={NavLink} to="/userlist" sx={navLinkStyle}>
              User List
            </Typography>
          </>
        )}

        {/* Logout Button */}
        <Button
          className="btn btn-danger ms-lg-2 mt-2 mt-lg-0"
          onClick={handleLogoutClick}
          sx={{
            width: "100%",
            justifyContent: "flex-start",
            color: "#cbd5e1",
            p: 2,
            borderRadius: 1,
            textTransform: "none",
            transition: "all 0.3s ease",
            "&:hover": {
              bgcolor: "#FB4141",
              color: "white",
              transform: "translateX(8px)",
            },
            minHeight: "48px",
          }}
          startIcon={<LogoutOutlined />}
        >
          Log Out
        </Button>
      </Stack>

      <Divider sx={{ bgcolor: "#B1F0F7", my: 2, opacity: 0.6, "&:hover": { opacity: 1 } }} />

      {/* Logout Dialog */}
      <Dialog open={openConfirmDialog} onClose={handleCancelLogout}>
        <DialogTitle sx={{ fontSize: "1.2rem", fontWeight: 600 }}>
          Konfirmasi Logout
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apakah Anda yakin ingin keluar dari aplikasi?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelLogout} color="secondary">
            Batal
          </Button>
          <Button onClick={handleConfirmLogout} color="error" autoFocus>
            Keluar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sidebar;
