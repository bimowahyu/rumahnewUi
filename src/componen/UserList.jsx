import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Container, Row, Col } from "reactstrap";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import UpdateUserModal from "./UpdateUserModal";
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
    <Container fluid className="user-list-container">
      <Row className="justify-content-center mt-4">
        <Col lg={10} md={12}>
          <div className="table-responsive">
            <Table striped bordered hover responsive className="mt-3 text-center">
              <thead className="table-dark">
                <tr>
                  <th>No</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role === "admin" ? "admin" : "surveyor"}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <Button color="warning" size="sm" className="me-2" onClick={() => handleUpdateClick(user)}>
                          <FaEdit /> Edit
                        </Button>
                        <Button color="danger" size="sm" onClick={() => deleteUser(user.id)}>
                          <FaTrash /> Hapus
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      Tidak ada data pengguna.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>

      {/* Modal Update */}
      <UpdateUserModal
        isOpen={updateModalOpen}
        toggle={handleUpdateModalClose}
        user={selectedUser}
        refreshUsers={getUsers}
      />
    </Container>
  );
};

export default UserList;