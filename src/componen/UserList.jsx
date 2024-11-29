import React, { useState, useEffect } from "react";
import axios from "axios";
import MyNavbar from "../map/Navbar";
import { Table, Button } from "reactstrap";
import Footer from "./Footer";
import Swal from "sweetalert2"; // Untuk notifikasi
import "./UserList.css";

export const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  // Fungsi untuk mendapatkan data user
  const getUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/user`, {
        withCredentials: true,
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fungsi untuk menghapus user
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
        // Refresh daftar user setelah penghapusan
        getUsers();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus user.", "error");
    }
  };

  return (
    <div className="page-container">
      {/* Navbar */}
      <MyNavbar />

      {/* Konten utama */}
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
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>
                  <Button
                    color="danger"
                    onClick={() => deleteUser(user.id)}
                  >
                    Hapus
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Footer tetap di bawah */}
      <Footer />
    </div>
  );
};

export default UserList;
