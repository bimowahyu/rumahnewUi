import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Typography,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
  Fade,
  Avatar,
  ButtonGroup
} from "@mui/material";
import { 
  Delete, 
  Edit, 
  Search, 
  Person, 
  Refresh, 
  PersonOutline 
} from "@mui/icons-material";
import Swal from "sweetalert2";
import UpdateUserModal from "./UpdateUserModal";
import Layout from "../layout/Layout";

// CSS styles
const styles = {
  userList: {
    "& .MuiTableCell-root": {
      fontSize: "0.875rem",
      padding: "16px"
    },
    "& .MuiTableRow-root:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.04)"
    }
  },
  searchBar: {
    marginBottom: 0, // Removed padding between search and table
    display: "flex",
    gap: 16,
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 2
  },
  cardHeader: {
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
    paddingBottom: 2,
    paddingTop: 2,
    backgroundColor: "#f9fafc"
  },
  roleChip: {
    fontWeight: "bold",
    textTransform: "capitalize",
    minWidth: "80px"
  },
  tableActions: {
    display: "flex",
    justifyContent: "center"
  },
  emptyState: {
    textAlign: "center",
    padding: "40px 0",
    color: "text.secondary"
  },
  avatar: {
    width: 32,
    height: 32,
    fontSize: "0.875rem",
    backgroundColor: "#1976d2",
    marginRight: 1
  },
  contentNoPadding: {
    padding: 0, // Remove padding from content
    '&:last-child': {
      paddingBottom: 0
    }
  }
};

export const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  
  useEffect(() => {
    getUsers();
  }, []);
  
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = users.filter(user => 
        user.username.toLowerCase().includes(lowercasedQuery) || 
        user.email.toLowerCase().includes(lowercasedQuery) ||
        user.role.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const getUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/user`, {
        withCredentials: true,
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Gagal mengambil data user");
      setLoading(false);
      Swal.fire("Error!", "Gagal mengambil data user", "error");
    }
  };

  const deleteUser = async (id) => {
    try {
      const confirm = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: "User akan dihapus secara permanen!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, hapus!",
      });

      if (confirm.isConfirmed) {
        await axios.delete(`${process.env.REACT_APP_URL}/deleteuser/${id}`, {
          withCredentials: true,
        });
        setSnackbar({
          open: true,
          message: "User berhasil dihapus",
          severity: "success"
        });
        getUsers();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setSnackbar({
        open: true,
        message: "Terjadi kesalahan saat menghapus user",
        severity: "error"
      });
    }
  };

  const handleUpdateClick = (user) => {
    setSelectedUser(user);
    setUpdateModalOpen(true);
  };

  const handleUpdateModalClose = () => {
    setUpdateModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserUpdated = () => {
    getUsers();
    setSnackbar({
      open: true,
      message: "User berhasil diupdate",
      severity: "success"
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return { bg: '#28a745', color: 'white' };
      case 'surveyor':
        return { bg: '#007bff', color: 'white' };
      default:
        return { bg: '#6c757d', color: 'white' };
    }
  };

  const getInitials = (name) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <Box sx={{ p: 3, maxWidth: "2200px", marginLeft: { xs: 0, md: "280px" }, mb: 4 }}>
      <Card elevation={2}>
        <CardContent sx={styles.cardHeader}>
          <Box sx={styles.header}>
            <Typography variant="h5" component="h1" fontWeight="500">
              <PersonOutline sx={{ verticalAlign: "middle", mr: 1 }} />
              Daftar Pengguna
            </Typography>
            <Tooltip title="Refresh data">
              <IconButton onClick={getUsers} size="small">
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
        
        <CardContent sx={{ pb: 0, pt: 2 }}>
          <Box sx={styles.searchBar}>
            <TextField
              placeholder="Cari berdasarkan username, email, atau role..."
              variant="outlined"
              size="small"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </CardContent>
        
        <CardContent sx={styles.contentNoPadding}>
          {error && (
            <Alert severity="error" sx={{ mb: 0 }}>
              {error}
            </Alert>
          )}
          
          {loading ? (
            <Box sx={styles.emptyState}>
              <CircularProgress size={40} />
              <Typography variant="body2" sx={{ mt: 2 }}>
                Memuat data pengguna...
              </Typography>
            </Box>
          ) : filteredUsers.length === 0 ? (
            <Box sx={styles.emptyState}>
              <Person sx={{ fontSize: 48, opacity: 0.3 }} />
              <Typography variant="body1" sx={{ mt: 2 }}>
                {searchQuery ? "Tidak ada pengguna yang sesuai dengan pencarian" : "Belum ada data pengguna"}
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: 0, border: 0 }}>
              <Table sx={styles.userList}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "rgba(0, 0, 0, 0.03)" }}>
                    <TableCell>ID</TableCell>
                    <TableCell>Pengguna</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell align="center">Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell width="10%">{user.id}</TableCell>
                      <TableCell width="25%">
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar sx={styles.avatar}>{getInitials(user.username)}</Avatar>
                          {user.username}
                        </Box>
                      </TableCell>
                      <TableCell width="35%">{user.email}</TableCell>
                      <TableCell width="15%">
                        <Chip 
                          label={user.role}
                          sx={{
                            ...styles.roleChip,
                            backgroundColor: getRoleColor(user.role).bg,
                            color: getRoleColor(user.role).color
                          }}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center" width="15%">
                        <ButtonGroup variant="outlined" size="small">
                          <Tooltip title="Edit pengguna">
                            <IconButton 
                              color="primary" 
                              onClick={() => handleUpdateClick(user)}
                              size="small"
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Hapus pengguna">
                            <IconButton 
                              color="error" 
                              onClick={() => deleteUser(user.id)}
                              size="small"
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {updateModalOpen && (
        <UpdateUserModal
          isOpen={updateModalOpen}  
          toggle={handleUpdateModalClose}  
          user={selectedUser}
          onUserUpdated={handleUserUpdated} 
        />
      )}
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        TransitionComponent={Fade}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserList;