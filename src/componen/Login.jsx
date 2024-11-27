import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { LoginAdmin, reset } from "../fitur/AuthSlice";
import useSWR from 'swr';
import { Row, Col } from "reactstrap";
import Footer from "./Footer";

const getApiBaseUrl = () => {
  const protocol = window.location.protocol === 'https:' ? 'https' : 'http';
  const baseUrl = process.env.REACT_APP_URL.replace(/^https?:\/\//, '');
  return `${protocol}://${baseUrl}`;
};

const fetcher = url => axios.get(url).then(res => res.data);

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.authAdmin
  );

  const { data, error } = useSWR(`${getApiBaseUrl()}/`, fetcher);

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    const savedPassword = localStorage.getItem('password');
    if (savedUsername && savedPassword) {
      setUsername(savedUsername);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (user || isSuccess) {
      navigate("/admin/dashboard");
    }
    dispatch(reset());
  }, [user, isSuccess, dispatch, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (rememberMe) {
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
    } else {
      localStorage.removeItem('username');
      localStorage.removeItem('password');
    }
    dispatch(LoginAdmin({ username, password }));
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <>
    <div className="login-container">
      <div className="logo-container" onClick={handleLogoClick}>
        <img src="/images/logobaru.png" alt="Logo Aplikasi" className="login-logo" />
        <h3 className="app-login-title">Sistem Informasi Pendataan Kualitas Rumah</h3>
      </div>
      <Row className="justify-content-center">
  <Col xs="12" md="6" lg="4">
    <form onSubmit={handleLogin} className="login-form shadow p-4 rounded">
      <h2 className="text-center mb-4">Login</h2>

      {isError && <p className="alert alert-danger">{message}</p>}
      {error ? (
        <p className="alert alert-danger">Server Offline</p>
      ) : data ? (
        <p className="alert alert-success">Server Online: {data}</p>
      ) : (
        <p className="alert alert-info">Checking server status...</p>
      )}

      {/* Username Input */}
      <div className="form-group mb-3">
        <label htmlFor="username" className="form-label">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Masukkan username"
          className="form-control"
          required
        />
      </div>

      {/* Password Input */}
      <div className="form-group mb-3">
        <label htmlFor="password" className="form-label">Password:</label>
        <div className="password-container position-relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password"
            className="form-control"
            required
          />
          <button
            type="button"
            className="password-toggle btn btn-link position-absolute end-0 top-50 translate-middle-y"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      {/* Remember Me Checkbox */}
      <div className="form-check mb-3">
        <input
          type="checkbox"
          id="rememberMe"
          className="form-check-input"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <label htmlFor="rememberMe" className="form-check-label">Remember me</label>
      </div>

      {/* Extra Links */}
      <div className="text-end mb-3">
        <a href="/reset-password" className="text-decoration-none">Lupa Password?</a>
      </div>

      {/* Submit Button */}
      <button type="submit" className="btn btn-primary w-100">
        <FaLock style={{ marginRight: "10px" }} />
        {isLoading ? "Loading..." : "Login"}
      </button>
    </form>
  </Col>
</Row>

    </div>
    <Footer />
    </>
  );
}

export default Login;
