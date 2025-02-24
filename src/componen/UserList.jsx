import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import Swal from "sweetalert2";
import UpdateUserModal from "./UpdateUserModal";
import Layout from "../layout/Layout";
import "./UserList.css";

export const UserList = () => {
  const [users, setUsers] = useState([]);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/user`, {
        withCredentials: true,
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
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
        Swal.fire("Berhasil!", "User telah dihapus.", "success");
        getUsers();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus user.", "error");
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

  return (
    <>
      <Box sx={{ p: 3, maxWidth: "2200px", marginLeft: { xs: 0, md: "280px" } }}>
        <Typography variant="h4" gutterBottom>Daftar Pengguna</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`role-badge ${user.role}`}>{user.role}</span>
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleUpdateClick(user)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => deleteUser(user.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {updateModalOpen && (
          <UpdateUserModal open={updateModalOpen} onClose={handleUpdateModalClose} user={selectedUser} />
        )}
      </Box>
    </>
  );
};
export default UserList;