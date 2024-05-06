import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  CircularProgress,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { URL } from "./config";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading state to true before fetching users
        const response = await axios.get(`${URL}/user`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false); // Set loading state to false after fetching users
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (userId) => {
    try {
      setLoading(true); // Set loading state to true before deleting user
      await axios.delete(`${URL}/user/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
      window.location.reload();
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setLoading(false); // Set loading state to false after deleting user
    }
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        User List
      </Typography>
      {loading ? (
        <CircularProgress /> // Render loading indicator if loading state is true
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="user table">
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Remove</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user._id}</TableCell>
                  <TableCell>
                    <Tooltip title="Delete">
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDelete(user._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default UserList;
