import React, { useState } from "react";
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
import { LogOutAdmin,reset } from "../../fitur/AuthSlice";
import axios from "axios";
// import smk9logo from "../../images/smklogo.png";

export const SidebarAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { user } = useSelector((state) => state.auth);
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
          { to: "/recap", text: "Rekapitulasi" },
          { to: "/admin/dashboard", text: "Dashboard" },
          { to: "/questionnaire", text: "Tambah Data" },
          { to: "/upload", text: "Upload Foto" },
          // { to: "/jurusan", text: "List Jurusan" },
        ].map((item) => (
          <Typography
            key={item.to}
            component={NavLink}
            to={item.to}
            sx={navLinkStyle}
          >
            {item.text}
          </Typography>
        ))}

        {/* Logout Button with Enhanced Styling */}
        <Button
          className="btn btn-danger ms-lg-2 mt-2 mt-lg-0"
          onClick={async () => {
            try {
              await axios.delete(`${process.env.REACT_APP_URL}/logout`, { withCredentials: true });
              sessionStorage.clear();
              navigate("/login");
            } catch (error) {
              console.error("Error during logout", error);
            }
          }}
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

export default SidebarAdmin;