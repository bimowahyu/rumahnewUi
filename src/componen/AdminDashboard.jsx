// Dashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { 
  AppBar, Toolbar, Typography, Container, Grid, Card, 
  CardContent, CardHeader, Box, Button, Avatar, Chip 
} from "@mui/material";
import { 
  Home, BarChart2, MapPin, FileText, UserPlus, 
  FileUp, Users, LogOut, Plus 
} from "lucide-react";
import "@fontsource/plus-jakarta-sans";
import { Grafik } from "./Grafik";
import "./Dashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f0f8ff' }}>
      {/* App Bar */}
      <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
        <Toolbar>
          <Box display="flex" alignItems="center" mr={1}>
            <img src="/images/logobaru.png" alt="Logo" height="40" />
          </Box>
          <Typography variant="p" component="div" sx={{ flexGrow: 1, fontFamily: 'Plus Jakarta Sans' }}>
            SISTEM INFORMASI PENDATAAN KUALITAS RUMAH
          </Typography>
          <Chip
            avatar={<Avatar>{user?.username?.charAt(0).toUpperCase()}</Avatar>}
            label={user ? user.username : "Guest"}
            variant="outlined"
            sx={{ color: 'white', borderColor: 'white' }}
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Grid container spacing={3}>
          {/* Charts Section */}
          <Grid item xs={12}>
            <Card elevation={3} sx={{ 
              borderRadius: '12px', 
              overflow: 'hidden',
              height: '500px',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
              }
            }}>
              <CardHeader 
                title="Statistik Perumahan Kabupaten" 
                sx={{ 
                  bgcolor: '#1976d2', 
                  color: 'white',
                  fontFamily: 'Plus Jakarta Sans'
                }}
              />
              <CardContent sx={{ p: 0, height: 'calc(100% - 72px)' }}>
                <Grafik />
              </CardContent>
            </Card>
          </Grid>

          {/* Welcome Card & Actions */}
          <Grid item xs={12}>
            <Card elevation={3} sx={{ 
              borderRadius: '12px',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
              }
            }}>
              <CardHeader 
                title={`Selamat Datang, ${user ? user.username : "Guest"}`}
                subheader="Panel administrasi pendataan rumah"
                sx={{ bgcolor: '#f5f5f5', fontFamily: 'Plus Jakarta Sans' }}
              />
              <CardContent>
                <Box textAlign="center" mb={3}>
                  <img src="/images/logobaru.png" alt="Logo Aplikasi" style={{ maxHeight: '120px' }} />
                </Box>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={12} sm={6} md={4} lg={3} sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<BarChart2 />}
                      onClick={() => navigate("/recap")}
                      sx={{
                        p: 2,
                        background: 'linear-gradient(135deg, #1abc9c, #3498db)',
                        borderRadius: '8px',
                        fontFamily: 'Plus Jakarta Sans',
                        textTransform: 'none',
                        fontSize: '1rem',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #16a085, #2980b9)',
                          transform: 'scale(1.03)'
                        }
                      }}
                    >
                      Rekapitulasi
                    </Button>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4} lg={3} sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<MapPin />}
                      onClick={() => navigate("/maps")}
                      sx={{
                        p: 2,
                        background: 'linear-gradient(135deg, #3498db, #9b59b6)',
                        borderRadius: '8px',
                        fontFamily: 'Plus Jakarta Sans',
                        textTransform: 'none',
                        fontSize: '1rem',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #2980b9, #8e44ad)',
                          transform: 'scale(1.03)'
                        }
                      }}
                    >
                      Sebaran Lokasi Rumah
                    </Button>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4} lg={3} sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Plus />}
                      onClick={() => navigate("/questionnaire")}
                      sx={{
                        p: 2,
                        background: 'linear-gradient(135deg, #1abc9c, #3498db)',
                        borderRadius: '8px',
                        fontFamily: 'Plus Jakarta Sans',
                        textTransform: 'none',
                        fontSize: '1rem',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #1abc9c, #3498db)',
                          transform: 'scale(1.03)'
                        }
                      }}
                    >
                      Tambah Data
                    </Button>
                  </Grid>
                  
                  {user && user.role === "admin" && (
                    <>
                      <Grid item xs={12} sm={6} md={4} lg={3} sx={{ display: "flex", justifyContent: "center" }}>
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<UserPlus />}
                          onClick={() => navigate("/register")}
                          sx={{
                            p: 2,
                            background: 'linear-gradient(135deg, #1abc9c, #3498db)',
                            borderRadius: '8px',
                            fontFamily: 'Plus Jakarta Sans',
                            textTransform: 'none',
                            fontSize: '1rem',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #1abc9c, #3498db)',
                              transform: 'scale(1.03)'
                            }
                          }}
                        >
                          Register
                        </Button>
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={4} lg={3} sx={{ display: "flex", justifyContent: "center" }}>
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<FileUp />}
                          onClick={() => navigate("/uploadpdf")}
                          sx={{
                            p: 2,
                            background: 'linear-gradient(135deg, #1abc9c, #3498db)',
                            borderRadius: '8px',
                            fontFamily: 'Plus Jakarta Sans',
                            textTransform: 'none',
                            fontSize: '1rem',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #1abc9c, #3498db)',
                              transform: 'scale(1.03)'
                            }
                          }}
                        >
                          Upload PDF
                        </Button>
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={4} lg={3} sx={{ display: "flex", justifyContent: "center" }}>
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<Users />}
                          onClick={() => navigate("/userlist")}
                          sx={{
                            p: 2,
                            background: 'linear-gradient(135deg, #1abc9c, #3498db)',
                            borderRadius: '8px',
                            fontFamily: 'Plus Jakarta Sans',
                            textTransform: 'none',
                            fontSize: '1rem',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #27ae60, #16a085)',
                              transform: 'scale(1.03)'
                            }
                          }}
                        >
                          User List
                        </Button>
                      </Grid>
                    </>
                  )}
                  
                  <Grid item xs={12} sm={6} md={4} lg={3} sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="error"
                      startIcon={<LogOut />}
                      onClick={handleLogout}
                      sx={{
                        p: 2,
                        borderRadius: '8px',
                        fontFamily: 'Plus Jakarta Sans',
                        textTransform: 'none',
                        fontSize: '1rem',
                        '&:hover': {
                          backgroundColor: '#b71c1c',
                          transform: 'scale(1.03)'
                        }
                      }}
                    >
                      Logout
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Box component="footer" sx={{ py: 3, bgcolor: '#e0f0ff', textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Dinas Perumahan dan Permukiman Kabupaten Sumbawa Barat.
        </Typography>
      </Box>
    </Box>
  );
}

export default AdminDashboard;