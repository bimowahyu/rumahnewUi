import React, { useState, useEffect } from "react";
import axios from "axios";
import MyNavbar from "../map/Navbar";
import { Table, Button } from "reactstrap";
import Footer from "./Footer";
import Swal from "sweetalert2";
import UpdateUserModal from "./UpdateUserModal";
import { FaEdit, FaTrash } from "react-icons/fa"; 
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
      Swal.fire({
        title: "Error!",
        text: "Gagal mengambil data user",
        icon: "error",
      });
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
    <div className="page-container">
      <MyNavbar />

      <div className="content-wrap">
        <div className="text">
          <p>List User</p>
          <p>Gunakan ID untuk input data manual melalui Excel</p>
        </div>

        <Table bordered hover responsive>
  <thead>
    <tr>
      <th>ID</th>
      <th>Username</th>
      <th>Email</th>
      <th>Role</th>
      <th>Aksi</th>
    </tr>
  </thead>
  <tbody>
    {users.map((user) => (
      <tr key={user.id}>
        <td>{user.id}</td>
        <td>{user.username}</td>
        <td>{user.email}</td>
        <td>{user.role}</td>
        <td className="table-actions">
  <Button
    // color="primary"
    onClick={() => handleUpdateClick(user)}
  >
    <FaEdit />
  </Button>
  <Button
    // color="danger"
    onClick={() => deleteUser(user.id)}
  >
    <FaTrash />
  </Button>
</td>

      </tr>
    ))}
  </tbody>
</Table>

        <UpdateUserModal
          isOpen={updateModalOpen}
          toggle={handleUpdateModalClose}
          user={selectedUser}
          onUserUpdated={getUsers}
        />
      </div>

      <Footer />
    </div>
  );
};

export default UserList;
