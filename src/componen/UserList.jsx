import React, { useState, useEffect } from "react";
import axios from "axios";
import MyNavbar from "../map/Navbar";
import { Table } from "reactstrap";
import Footer from "./Footer";
import "./UserList.css"

export const UserList = () => {
  const [users, setUsers] = useState([]);

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
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
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
