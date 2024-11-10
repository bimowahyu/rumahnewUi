import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { LoginAdmin, reset } from "../fitur/AuthSlice";
import useSWR from 'swr';

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
    <div className="login-container">
      <div className="logo-container" onClick={handleLogoClick}>
        <img src="/images/logo.png" alt="Logo Aplikasi" className="login-logo" />
        <h3 className="app-login-title">Sistem Web Database Perumahan</h3>
      </div>
      <form onSubmit={handleLogin}>
        {isError && <p className="error-message">{message}</p>}
        {error ? (
          <p className="error-message">Server Offline</p>
        ) : data ? (
          <p className="success-message">Server Online: {data}</p>
        ) : (
          <p className="loading-message">Checking server status...</p>
        )}
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Masukkan username" required />
        </label>
        <label>
          Password:
          <div className="password-container">
            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan password" required />
            <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </label>
        <div className="field">
          <label className="checkbox">
            <input 
              type="checkbox" 
              checked={rememberMe} 
              onChange={(e) => setRememberMe(e.target.checked)} 
            /> Remember me
          </label>
        </div>
        <div className="extra-links">
          <a href="/reset-password">Lupa Password?</a>
        </div>
        <button type="submit">
          <FaLock style={{ marginRight: "10px" }} />
          {isLoading ? "Loading..." : "Login"}
        </button>
        <p>Belum Punya Akun? Silahkan Mendaftar</p>
        <div className="register-link">
          <a href="/register" className="register-button">
            Saya Ingin Mendaftar
          </a>
        </div>
      </form>
    </div>
  );
}

export default Login;
