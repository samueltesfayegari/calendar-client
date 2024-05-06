import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { URL } from "./config";

const EventList = ({ userID }) => {
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [events, setEvents] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading state to true before fetching user data
        const response = await axios.get(`${URL}/user`);
        const users = response.data;
        const user = users.find(user => user._id === userID);
        setUsername(user ? user.username : "User not found");
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false); // Set loading state to false after fetching user data
      }
    }

    fetchData();
  }, [userID]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true); // Set loading state to true before fetching events
      const response = await axios.get(`${URL}/events`);
      // Filter events based on userID after receiving the response
      const filteredEvents = response.data.filter(
        (event) => event.user === userID
      );
      setEvents(filteredEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false); // Set loading state to false after fetching events
    }
  };

  const handleDelete = async (eventId) => {
    try {
      setLoading(true); // Set loading state to true before deleting event
      await axios.delete(`${URL}/events/${eventId}`);
      fetchEvents();
      window.location.reload();
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setLoading(false); // Set loading state to false after deleting event
    }
  };

  return (
    <div className="container mt-4">
      {/* Render loading indicator if loading state is true */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {/* Render event list once data is loaded */}
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
        </>
      )}
    </div>
  );
};

export default EventList;
