import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch and useSelector
import { getEvents, createEvent } from "../actions/events";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css"; // Import custom calendar styles
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { Modal, Button } from "react-bootstrap"; // Import Bootstrap components
import EventList from "./eventList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { URL } from "./config";
import DateRangeModal from "./dateRange.js";

const Calendar = () => {
  const dispatch = useDispatch(); // Initialize dispatch

  const [date, setDate] = useState(new Date());
  const [user, setUser] = useState();
  const [showModal, setShowModal] = useState(false);
  const [eventData, setEventData] = useState({
    book: "Rez-de-chaussée 2 pièces avec 3 lits",
  });
  const [username, setUsername] = useState("");
  const [existingEventModal, setExistingEventModal] = useState(false); // New state for existing event modal
  const [existingEventUser, setExistingEventUser] = useState(""); // State to store existing event user
  const [showDateRangeModal, setShowDateRangeModal] = useState(false); // State for showing date range modal

  // Get the userId from the URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  let userId = urlParams.get("Id");

  // If userId is not null, store it in the session storage
  if (userId !== null) {
    localStorage.setItem("userId", userId);
  }

  // If userId is null and there's a userId stored in the session storage, use that
  const storedUserId = localStorage.getItem("userId");
  if (userId === null && storedUserId !== null) {
    userId = storedUserId;
  }

  // Fetch events from Redux store
  const events = useSelector((state) => state.events);

  useEffect(() => {
    // Fetch events from backend API when component mounts
    dispatch(getEvents());
  }, [dispatch]);

  const handleClickDay = (value) => {
    setShowModal(true);
    const utcDate = new Date(
      value.getTime() - value.getTimezoneOffset() * 60000
    );
    setDate(utcDate);
  };

  const allDates = events.map((event) => event.date);

  // Count occurrences of each date
  const dateCounts = allDates.reduce((counts, date) => {
    counts[date] = (counts[date] || 0) + 1;
    return counts;
  }, {});

  const tileClassName = ({ date }) => {
    const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    const formattedDate = utcDate.toISOString().slice(0, 10);

    const allDates = events.map((event) => event.date);

    // Count occurrences of each date
    const dateCounts = allDates.reduce((counts, date) => {
      counts[date] = (counts[date] || 0) + 1;
      return counts;
    }, {});

    // Filter out dates that occurred only once
    const uniqueDates = Object.keys(dateCounts).filter(
      (date) => dateCounts[date] === 4
    );

    const event = uniqueDates.find((event) => event === formattedDate);

    if (event) {
      return "available-date";
    }
    return ""; // Leave other dates unaffected
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    const formattedDate = utcDate.toISOString().slice(0, 10);

    try {
      // Check if there's an event on the same date with the selected eventData.book
      const existingEvent = events.find(
        (event) => event.date === formattedDate && event.book === eventData.book
      );
      if (existingEvent) {
        try {
          const response = await axios.get(`${URL}/user`);
          const users = response.data;
          const user = users.find((user) => user._id === existingEvent.user);
          setExistingEventUser(user ? user.username : "User not found");
        } catch (error) {
          console.error("Error:", error);
        }

        // If an event already exists, show the existing event modal
        setExistingEventModal(true);
        return;
      }

      // If no event exists, dispatch createEvent action with eventData
      dispatch(
        createEvent({
          date: formattedDate,
          book: eventData.book,
          user: userId,
        })
      );

      setShowModal(false);
      setEventData({ title: "", availability: "available" });
    } catch (error) {
      console.error("Error creating event:", error);
    }
    window.location.reload();
  };

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem("token");
    // Clear the userId from localStorage
    localStorage.removeItem("userId");
    // Redirect to the login page or any other appropriate action
    // For simplicity, let's just reload the page
    window.location.reload();
  };

  return (
    <div className="calendar-container">
      <h1 className="text-center mt-3 mb-3">
        Unavailable or All options taken Dates would be bouncing!!
      </h1>
      <ReactCalendar
        onChange={setDate}
        value={date}
        onClickDay={handleClickDay}
        tileClassName={tileClassName}
      />
      {/* Button to toggle DateRangeModal */}
      <Button
        variant="primary"
        onClick={() => setShowDateRangeModal(true)}
        className="mt-3 mb-3"
      >
        Multiple Booking
      </Button>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddEvent}>
            <div className="mb-3">
              <label className="form-label">Book:</label>
              <select
                className="form-select"
                value={eventData.book}
                onChange={(e) =>
                  setEventData({ ...eventData, book: e.target.value })
                }
              >
                <option value="Rez-de-chaussée 2 pièces avec 3 lits">
                  Rez-de-chaussée 2 pièces avec 3 lits
                </option>
                <option value="Premier étage 3 pièces avec 3 lits">
                  Premier étage 3 pièces avec 3 lits
                </option>
                <option value="Deuxième étage 3 pièces avec 3 lits + Jacuzzi">
                  Deuxième étage 3 pièces avec 3 lits + Jacuzzi
                </option>
                <option value="Studio rez-de-chaussée avec 1 lit">
                  Studio rez-de-chaussée avec 1 lit
                </option>
              </select>
            </div>
            <Button variant="primary" type="submit">
              Add Event
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      <EventList userID={userId} />

      <Button
        variant="danger"
        onClick={handleLogout}
        className="logout-button mt-3 mb-3"
        style={{
          backgroundColor: "transparent",
          border: "none",
          color: "black",
        }}
      >
        <FontAwesomeIcon icon={faSignOutAlt} /> Log out
      </Button>

      {/* Modal for informing the user about existing event */}
      <Modal
        show={existingEventModal}
        onHide={() => setExistingEventModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Existing Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{`Taken by ${existingEventUser}`}</p>
          <Button
            variant="secondary"
            onClick={() => setExistingEventModal(false)}
          >
            Close
          </Button>
        </Modal.Body>
      </Modal>

      {/* DateRangeModal */}
      <DateRangeModal
        show={showDateRangeModal}
        onHide={() => setShowDateRangeModal(false)}
        userID={userId}
      />
    </div>
  );
};

export default Calendar;
