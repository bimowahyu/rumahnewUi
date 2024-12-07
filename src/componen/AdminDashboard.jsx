import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import "./Dashboard.css"
import "./Grafik.jsx"


import { Grafik } from "./Grafik.jsx";
import DashboardWidget from "./DashboardWidget.jsx";


function AdminDashboard() {
  const navigate = useNavigate();
  // const [username, setUsername] = useState("");
 
  const { user } = useSelector((state) => state.authAdmin || {});
  
  const handleLogout = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_URL}/logout`, { withCredentials: true });
      sessionStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout", error);
    }
  };


  return (
    <>
    <div className="page-container">
    <header>
      {/* <p>Welcome, {user ? user.username : "Guest"}</p> */}
    </header>
    <div>
      <Grafik />
    </div>
    <main className="content">
      <div className="widget-center">
      <DashboardWidget
              title={`Welcome ${user ? user.username : "Guest"}`}
              content={
                <>
                  {/* Logo */}
                  <div className="logo-container">
                    <img src="/images/logobaru.png" alt="Logo Aplikasi" className="login-logo" />
                  </div>

                  {/* Quick Actions */}
                  <div className="quick-actions">
                  <button
                      onClick={() => navigate("/recap")}
                      style={{
                        background: "linear-gradient(135deg, #1abc9c, #3498db)",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        transition: "background 0.3s ease",
                      }}
                    >
                      Rekapitulasi
                    </button>
                    <button
                      onClick={() => navigate("/maps")}
                      style={{
                        background: "linear-gradient(135deg, #1abc9c, #3498db)",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        transition: "background 0.3s ease",
                      }}
                    >
                      Sebaran Lokasi Rumah
                    </button>

                    <button
                      onClick={() => navigate("/questionnaire")}
                      style={{
                        background: "linear-gradient(135deg, #1abc9c, #3498db)",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        transition: "background 0.3s ease",
                      }}
                    >
                      Tambah Data
                    </button>
                    {user && user.role === "admin" && (
                      <>
                        <button onClick={() => navigate("/register")}>Register</button>
                        <button onClick={() => navigate("/uploadpdf")}>Upload Pdf</button>
                        <button onClick={() => navigate("/userlist")}>User list</button>
                      </>
                    )}
                    <button className="btn btn-danger" style={{ background: 'red' }}onClick={() => handleLogout()}>Logout</button>
                  </div>
                </>
              }
            />
      </div>
    </main>
  </div>
  <div className="new">

  </div>
  </>
  );
}

export default AdminDashboard;
