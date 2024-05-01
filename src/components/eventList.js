import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { URL } from "./config";

const EventList = ({ userID }) => {
  const [events, setEvents] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${URL}/user`);
        const users = response.data;
        const user = users.find(user => user._id === userID);
        setUsername(user ? user.username : "User not found");
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchData();
  }, [userID]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${URL}/events`);
      // Filter events based on userID after receiving the response
      const filteredEvents = response.data.filter(
        (event) => event.user === userID
      );
      setEvents(filteredEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      await axios.delete(`${URL}/events/${eventId}`);
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Event List</h1>
      <p className="card-text">Hello, {username}</p>
      <div className="row">
        {events.map((event) => (
          <div key={event._id} className="col-lg-4 col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <p className="card-text">Date: {event.date}</p>
                <p className="card-text">Book: {event.book}</p>
                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-link text-danger"
                    onClick={() => handleDelete(event._id)}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
