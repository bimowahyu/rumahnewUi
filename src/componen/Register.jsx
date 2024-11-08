import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
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
      await axios.post(`${process.env.REACT_APP_URL}/register`, formData);
      setSuccess("Surveyor registered successfully");
      setError("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to register user");
      setSuccess("");
      console.error("Error registering:", error);
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="register-container">
      <div className="logo-container" onClick={handleLogoClick}>
        <img src="/images/logo.png" alt="Logo Aplikasi" className="register-logo" />
        <h3 className="app-register-title">Sistem Web Database Perumahan</h3>
      </div>
      {error && <Alert color="danger">{error}</Alert>}
      {success && <Alert color="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="username">Username</Label>
          <Input type="text" name="username" id="username" value={formData.username} onChange={handleChange} placeholder="Enter your username" />
        </FormGroup>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input type="email" name="email" id="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" />
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          <div className="password-container">
            <Input type={showPassword ? "text" : "password"} name="password" id="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" />
            <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <i className="fas fa-eye-slash"></i> // Font Awesome eye-slash icon
              ) : (
                <i className="fas fa-eye"></i> // Font Awesome eye icon
              )}
            </button>
          </div>
        </FormGroup>
        <Button type="submit" color="primary">
          Register
        </Button>
      </Form>
    </div>
  );
};

export default Register;
