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

function ResetPassword() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.authAdmin
  );

  const { data, error } = useSWR(`${getApiBaseUrl()}/`, fetcher);

  useEffect(() => {
    if (user || isSuccess) {
      navigate("/admin/dashboard");
    }
    dispatch(reset());
  }, [user, isSuccess, dispatch, navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${getApiBaseUrl()}/reset`, {
        email,
        username,
        newPassword,
      });
      alert(response.data.msg);
      navigate('/login')
    } catch (err) {
      alert(err.response?.data?.msg || "Terjadi kesalahan saat reset password.");
    }
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
        <Col xs="12" md="10" className="mb-3">
          <form onSubmit={handleResetPassword} className="reset-password-form">
            <h2>Reset Password</h2>
            <label>
              Email:
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Masukkan email" required />
            </label>
            <label>
              Username:
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Masukkan username" required />
            </label>
            <label>
              Password Baru:
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Masukkan password baru"
                  required
                />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </label>
            <button type="submit">
              <FaLock style={{ marginRight: "10px" }} />
              Reset Password
            </button>
          </form>
        </Col>
      </Row>
    </div>
    <Footer />
    </>
  );
}

export default ResetPassword;
