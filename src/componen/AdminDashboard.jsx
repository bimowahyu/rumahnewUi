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
                    <button onClick={() => navigate("/recap")}>Rekapitulasi</button>
                    <button onClick={() => navigate("/questionnaire")}>Tambah Data</button>
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
  
  );
}

export default AdminDashboard;
