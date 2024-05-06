import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getEvents, createEvent } from "../actions/events";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import EventList from "./eventList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { URL } from "./config";
import DateRangeModal from "./dateRange.js";

const Calendar = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [date, setDate] = useState(new Date());
  const [user, setUser] = useState();
  const [showModal, setShowModal] = useState(false);
  const [eventData, setEventData] = useState({
    book: "Rez-de-chaussée 2 pièces avec 3 lits",
  });
  const [username, setUsername] = useState("");
  const [existingEventModal, setExistingEventModal] = useState(false);
  const [existingEventUser, setExistingEventUser] = useState("");
  const [showDateRangeModal, setShowDateRangeModal] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  let userId = urlParams.get("Id");

  if (userId !== null) {
    localStorage.setItem("userId", userId);
  }

  const storedUserId = localStorage.getItem("userId");
  if (userId === null && storedUserId !== null) {
    userId = storedUserId;
  }

  const events = useSelector((state) => state.events);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading state to true before fetching data
        await dispatch(getEvents());
        setLoading(false); // Set loading state to false after fetching data
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleClickDay = (value) => {
    setShowModal(true);
    const utcDate = new Date(
      value.getTime() - value.getTimezoneOffset() * 60000
    );
    setDate(utcDate);
  };

  const tileClassName = ({ date }) => {
    const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    const formattedDate = utcDate.toISOString().slice(0, 10);

    const allDates = events.map((event) => event.date);

    const dateCounts = allDates.reduce((counts, date) => {
      counts[date] = (counts[date] || 0) + 1;
      return counts;
    }, {});

    const uniqueDates = Object.keys(dateCounts).filter(
      (date) => dateCounts[date] === 4
    );

    const event = uniqueDates.find((event) => event === formattedDate);

    if (event) {
      return "available-date";
    }
    return "";
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    const formattedDate = utcDate.toISOString().slice(0, 10);

    try {
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

        setExistingEventModal(true);
        return;
      }

      dispatch(
        createEvent({
          date: formattedDate,
          book: eventData.book,
          user: userId,
        })
      );

      setShowModal(false);
      setEventData({ title: "", availability: "available" });
      window.location.reload();
    } catch (error) {
      console.error("Error creating event:", error);
    }
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.reload();
  };

  return (
    <div className="calendar-container">
      {/* Render loading indicator if loading state is true */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {/* Render calendar and other components once data is loaded */}
          <h1 className="text-center mt-3 mb-3">
            Unavailable or All options taken Dates would be bouncing!!
          </h1>
          <ReactCalendar
            onChange={setDate}
            value={date}
            onClickDay={handleClickDay}
            tileClassName={tileClassName}
          />
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

          <DateRangeModal
            show={showDateRangeModal}
            onHide={() => setShowDateRangeModal(false)}
            userID={userId}
          />
        </>
      )}
    </div>
  );
};

export default Calendar;
