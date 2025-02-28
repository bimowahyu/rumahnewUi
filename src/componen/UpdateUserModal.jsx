import React, { useState,useEffect  } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input } from "reactstrap";
import axios from "axios";
import Swal from "sweetalert2";
import './UpdateUserModal.css'

const UpdateUserModal = ({ isOpen, toggle, user, onUserUpdated }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setRole(user.role || "");
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      const payload = {
        username: username || user.username,
        email: email || user.email,
        role: role || user.role,
        password: password || undefined,
      };

      await axios.put(`${process.env.REACT_APP_URL}/updateuser/${user.id}`, payload, {
        withCredentials: true,
      });

      Swal.fire("Berhasil!", "Data user berhasil diperbarui.", "success");
      toggle();
      onUserUpdated();
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire("Gagal!", "Terjadi kesalahan saat memperbarui user.", "error");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} modalClassName="custom-modal">
      <ModalHeader toggle={toggle}>Update User</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
            />
          </FormGroup>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
            />
          </FormGroup>
          <FormGroup>
            <Label for="role">Role</Label>
            <Input
              id="role"
              type="select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="surveyor">Surveyor</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="password">Password (Opsional)</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password baru (jika ada)"
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleUpdate}>
          Simpan
        </Button>
        <Button color="secondary" onClick={toggle}>
          Batal
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default UpdateUserModal;
