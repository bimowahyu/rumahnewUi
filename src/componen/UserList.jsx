import React, { useState, useEffect } from "react";
import axios from "axios";
import MyNavbar from "../map/Navbar";
import { Table } from "reactstrap";

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
    <div>
      <MyNavbar />
      <h2>List User</h2>
      <p>Gunakan ID untuk input data manual melalui Excel</p>
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            {/* <th>Email</th>
            <th>Role</th> */}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              {/* <td>{user.email}</td>
              <td>{user.role}</td> */}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserList;
