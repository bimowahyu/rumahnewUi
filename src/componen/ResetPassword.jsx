import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import BackgroundImage from "../images/map4.jpg";

const getApiBaseUrl = () => {
  const protocol = window.location.protocol === "https:" ? "https" : "http";
  const baseUrl = process.env.REACT_APP_URL.replace(/^https?:\/\//, "");
  return `${protocol}://${baseUrl}`;
};

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${getApiBaseUrl()}/reset`, {
        email,
        username,
        newPassword,
      });
      alert(response.data.msg);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "Terjadi kesalahan saat reset password.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backdropFilter: "blur(5px)",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: "90%",
          maxWidth: 380,
          textAlign: "center",
          borderRadius: 3,
          bgcolor: "rgba(255, 255, 255, 0.95)",
        }}
      >
        {/* Logo */}
        <img
          src="/images/logobaru.png"
          alt="Logo Aplikasi"
          style={{ width: "80px", marginBottom: "10px" }}
        />
        <Typography variant="h6" gutterBottom>
          Sistem Informasi Pendataan Kualitas Rumah
        </Typography>

        {/* Form */}
        <form onSubmit={handleResetPassword}>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            variant="filled"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{
              "& .MuiFilledInput-root": {
                backgroundColor: "white",
                borderRadius: "8px",
              },
              "& .MuiFilledInput-underline:before, & .MuiFilledInput-underline:after": {
                display: "none",
              },
            }}
          />

          <TextField
            fullWidth
            label="Username"
            margin="normal"
            variant="filled"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            sx={{
              "& .MuiFilledInput-root": {
                backgroundColor: "white",
                borderRadius: "8px",
              },
              "& .MuiFilledInput-underline:before, & .MuiFilledInput-underline:after": {
                display: "none",
              },
            }}
          />

          <TextField
            fullWidth
            label="Password Baru"
            type={showPassword ? "text" : "password"}
            margin="normal"
            variant="filled"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            sx={{
              "& .MuiFilledInput-root": {
                backgroundColor: "white",
                borderRadius: "8px",
              },
              "& .MuiFilledInput-underline:before, & .MuiFilledInput-underline:after": {
                display: "none",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Tombol Reset Password */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              mt: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <FaLock size={14} /> Reset Password
          </Button>
        </form>

        {/* Tombol Kembali ke Login */}
        <Button
          fullWidth
          variant="text"
          color="primary"
          onClick={() => navigate("/login")}
          sx={{ mt: 1, textTransform: "none" }}
        >
          Kembali ke Login
        </Button>
      </Paper>
    </Box>
  );
};

export default ResetPassword;
