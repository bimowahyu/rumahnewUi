import React, { useState,useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { LogoutOutlined } from "@mui/icons-material";
import { LogOutAdmin, reset } from "../../fitur/AuthSlice";
import axios from "axios";
import { getMeAdmin } from "../../fitur/AuthSlice";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
// import smk9logo from "../../images/smklogo.png";

export const Sidebar = () => {
   const { isError } = useSelector((state) => state.authAdmin);
    
      
    
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function renderTooltip(message) {
    return <Tooltip>{message}</Tooltip>;
  }
  const auth = useSelector((state) => state.authAdmin || {});
const user = auth.user || null;
console.log("Auth State:", auth);
console.log("User Data:", user);
useEffect(() => {
  dispatch(getMeAdmin());
}, [dispatch]);

  
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleLogoutClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
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
        color: "blue",
        display: { xs: "block", lg: "flex" },
        flexDirection: "column",
        height: "100vh",
        width: { xs: 200, lg: 250 },
        position: "fixed",
        top: 0,
        left: 0,
        p: 2,
        zIndex: 1200,
        overflowY: "auto",
        overflowX: "hidden",
        WebkitOverflowScrolling: "touch",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "rgba(0,0,0,0.1)",
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#B1F0F7",
          borderRadius: "10px",
          "&:hover": {
            backgroundColor: "#90E0E7",
          },
        },
        transition: {
          xs: "none",
          lg: "all 0.3s ease" 
        }
      }}
    >
      {/* Logo Section with Animation */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 60,
          mb: 3,
          borderBottom: "1px solid rgb(46, 125, 251)",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      >
       <img src="/images/logobaru.png" alt="Logo Aplikasi" className="homelogo" />
       <Box>
       <span className="brand-text">Sistem Informasi Pendataan<br></br> Kualitas Rumah</span>
       </Box>
       
      </Box>
     

      {/* Navigation Links with Hover Effects */}
      <Stack spacing={2} sx={{ flex: 1 }}>
  {[
    { to: "/admin/dashboard", text: "Dashboard", overlay: "Halaman Dashboard" },
    { to: "/recap", text: "Rekapitulasi", overlay: "Lihat Rekapitulasi Data Rumah" },
    { to: "/questionnaire", text: "Tambah Data", overlay: "Tambah Data Rumah Baru" },
    { to: "/upload", text: "Upload Foto Manual", overlay: "Upload Foto Rumah Berdasarkan Data Yang Telah Di Input" }
  ].map((item) => (
    <OverlayTrigger key={item.to} placement="right" overlay={renderTooltip(item.overlay)}>
      <Typography component={NavLink} to={item.to} sx={navLinkStyle}>
        {item.text}
      </Typography>
    </OverlayTrigger>
  ))}

  {/* Menu Khusus Admin */}
  {user && user.role && user.role === "admin" && (
  <>
    <OverlayTrigger placement="right" overlay={renderTooltip("Manajemen Admin")}>
      <Typography component={NavLink} to="/register" sx={navLinkStyle}>
        Register
      </Typography>
    </OverlayTrigger>
    <OverlayTrigger placement="right" overlay={renderTooltip("Upload PDF")}>
      <Typography component={NavLink} to="/uploadpdf" sx={navLinkStyle}>
        Upload PDF
      </Typography>
    </OverlayTrigger>
    <OverlayTrigger placement="right" overlay={renderTooltip("User List")}>
      <Typography component={NavLink} to="/userlist" sx={navLinkStyle}>
        User List
      </Typography>
    </OverlayTrigger>
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
      touchAction: "manipulation",
    }}
    startIcon={<LogoutOutlined />}
  >
    Log Out
  </Button>
</Stack>


      <Divider
        sx={{
          bgcolor: "#B1F0F7",
          my: 2,
          opacity: 0.6,
          transition: "opacity 0.3s ease",
          "&:hover": {
            opacity: 1,
          },
        }}
      />

      {/* Logout Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCancelLogout}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "1.2rem", fontWeight: 600 }}>
          Konfirmasi Logout
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apakah Anda yakin ingin keluar dari aplikasi?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCancelLogout}
            color="secondary"
            sx={{
              borderRadius: 1,
              textTransform: "none",
              "&:hover": { bgcolor: "rgba(0,0,0,0.05)" },
            }}
          >
            Batal
          </Button>
          <Button
            onClick={handleConfirmLogout}
            color="error"
            autoFocus
            sx={{
              borderRadius: 1,
              textTransform: "none",
              "&:hover": { bgcolor: "#FB4141", color: "white" },
            }}
          >
            Keluar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sidebar;