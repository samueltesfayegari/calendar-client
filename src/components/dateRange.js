import React, { useState, useEffect } from "react";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch and useSelector
import { getEvents, createEvent } from "../actions/events";

const DateRangeModal = ({ show, onHide, userID }) => {
  const dispatch = useDispatch(); // Initialize dispatch
  useEffect(() => {
    // Fetch events from backend API when component mounts
    dispatch(getEvents());
  }, [dispatch]);

  // Fetch events from Redux store
  const events = useSelector((state) => state.events);

  const [selectedDates, setSelectedDates] = useState([]);
  const [disableCalendar, setDisableCalendar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [eventData, setEventData] = useState({
    book: "Rez-de-chaussée 2 pièces avec 3 lits",
  });

  const handleDayClick = (value) => {
    if (selectedDates.length === 2) return;
    const selectedDateUTC = new Date(
      Date.UTC(value.getFullYear(), value.getMonth(), value.getDate())
    );
    const dateIndex = selectedDates.findIndex(
      (date) => date.getTime() === selectedDateUTC.getTime()
    );
    if (dateIndex === -1) {
      setSelectedDates([...selectedDates, selectedDateUTC]);
      if (selectedDates.length + 1 === 2) {
        setDisableCalendar(true);
      }
    } else {
      const updatedDates = [...selectedDates];
      updatedDates.splice(dateIndex, 1);
      setSelectedDates(updatedDates);
      setDisableCalendar(false);
    }
  };

  const handleReset = () => {
    setSelectedDates([]);
    setDisableCalendar(false);
  };

  const handleConfirm = () => {
    const formattedDates = selectedDates.map(
      (date) => date.toISOString().split("T")[0]
    );
    setShowModal(true); // Show modal for adding events
  };

  const handleAddEvent = () => {
    // Check if there are existing events with the same date and book
    const isExistingEvent = events.some((event) =>
      selectedDates.some(
        (date) =>
          event.date === date.toISOString().split("T")[0] &&
          event.book === eventData.book
      )
    );

    if (isExistingEvent) {
      // Show a message to the user indicating that events already exist for the selected date and book
      alert("Events already exist for the selected date and book.");
    } else {
      // Generate array of dates between start and end dates
      const datesBetween = [];
      const startDate = selectedDates[0];
      const endDate = selectedDates[1];
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        datesBetween.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Dispatch events for each date
      datesBetween.forEach((date) => {
        dispatch(
          createEvent({
            date: date.toISOString().split("T")[0],
            book: eventData.book,
            user: userID,
          })
        );
      });

      setShowModal(false);
      window.location.reload();
    }
  };

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
          <Button variant="primary" onClick={handleAddEvent}>
            Add Events
          </Button>
        </Modal.Body>
      </Modal>

      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Select Dates</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ReactCalendar
            selectRange={false}
            onClickDay={handleDayClick}
            value={selectedDates}
            tileDisabled={({ date }) =>
              disableCalendar &&
              !selectedDates.some(
                (selectedDate) =>
                  selectedDate.toDateString() === date.toDateString()
              )
            }
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleReset}>
            Reset
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={selectedDates.length !== 2}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DateRangeModal;
