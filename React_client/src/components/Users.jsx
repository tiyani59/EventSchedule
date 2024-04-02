import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserTable from "./UserTable"; // Import the UserTable component

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null); // Define editingUser state

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://localhost:7171/api/User");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token not found in local storage");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.delete(
        `https://localhost:7171/api/User/${id}`,
        config
      );

      if (response.status === 200) {
        setUsers(users.filter((user) => user.id !== id));
        toast.success("User deleted successfully");
      } else {
        toast.error("Failed to delete user");
        throw new Error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const handleSaveEdit = async (editedUserData) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token not found in local storage");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        `https://localhost:7171/api/User/${editedUserData.id}`,
        editedUserData,
        config
      );

      if (response.status === 204) {
        setUsers(
          users.map((user) =>
            user.id === editedUserData.id ? editedUserData : user
          )
        );
        toast.success("User updated successfully");

        // Exit edit mode
        setEditingUser(null); // Reset editingUser state to null
      } else {
        toast.error("Failed to update user");
        throw new Error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  return (
    <UserTable
      users={users}
      handleDelete={handleDelete}
      handleSaveEdit={handleSaveEdit}
      setEditingUser={setEditingUser}
    />
  );
};

export default Users;
