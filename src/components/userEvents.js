import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
} from '@mui/material';
import { URL } from './config';

const UserEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${URL}/events`);
        setEvents(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching event data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Event List
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="event table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Book</TableCell>
                <TableCell>User</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event._id}>
                  <TableCell>{event.date}</TableCell>
                  <TableCell>{event.book}</TableCell>
                  <TableCell>{event.user}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default UserEvents;
