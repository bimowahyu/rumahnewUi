import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
import Footer from "./Footer";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_URL}/register`, formData, {
        withCredentials: true,
      });
      setSuccess("Surveyor registered successfully");
      setError("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to register user");
      setSuccess("");
      console.error("Error registering:", error);
    }
  };

  return (
    <>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "90vh",
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

        {/* Status Messages */}
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="success">{success}</Typography>}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            margin="normal"
            variant="filled"
            name="username"
            value={formData.username}
            onChange={handleChange}
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
            label="Email"
            margin="normal"
            variant="filled"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
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
            label="Password"
            type={showPassword ? "text" : "password"}
            margin="normal"
            variant="filled"
            name="password"
            value={formData.password}
            onChange={handleChange}
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

          {/* Tombol Register */}
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
            <FaLock size={14} /> Register
          </Button>
        </form>
      </Paper>
    </Box>
    <Footer />
    </>
  );
};

export default Register;
