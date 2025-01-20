import React, { useState, useEffect } from "react";
import { Container, Button, TextField, Typography, Alert } from "@mui/material";
import CustomDatePicker from "../components/DatePicker";
import TimezoneSelect from "../components/TimezoneSelect";
import FreeSlots from "../components/FreeSlots";
import Loader from "../components/Loader";
import dayjs from "dayjs";
import { fetchAvailableSlots, createEvent } from "../api/appointmentService";

const BookEvent = () => {
  const [date, setDate] = useState(dayjs());
  const [duration, setDuration] = useState(30);
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Clear slots when timezone changes
  useEffect(() => {
    setSlots([]);
    setSelectedSlot("");
  }, [timezone]);

  const fetchSlots = async () => {
    if (!date || !timezone) {
      setMessage({ type: "error", text: "Please select a valid date and timezone." });
      return;
    }

    console.log("fetchSlots", date, timezone);
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      const availableSlots = await fetchAvailableSlots(formattedDate, timezone);
      setSlots(availableSlots.availableSlots);
    } catch (error) {
      console.error("Failed to fetch slots", error);
      setMessage({ type: "error", text: "Failed to fetch slots. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  const bookEvent = async () => {
    if (!selectedSlot) {
      setMessage({ type: "error", text: "Please select a time slot." });
      return;
    }
    if (isNaN(duration) || duration <= 0) {
      setMessage({ type: "error", text: "Invalid duration. Please enter a valid number." });
      return;
    }

    setLoading(true);

    try {
      await createEvent(selectedSlot, parseInt(duration, 10), timezone);
      setMessage({ type: "success", text: "Event booked successfully!" });
      setSlots(slots.filter((slot) => slot !== selectedSlot)); // Remove booked slot
      setSelectedSlot("");
    } catch (error) {
      setMessage({ type: "error", text: "Error booking event. Slot may be taken." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ marginTop: '16px' }}>
        Book an Appointment
      </Typography>

      {message.text && <Alert severity={message.type}>{message.text}</Alert>}

      <CustomDatePicker label="Select Date" value={date} onChange={setDate} />
      <TextField
        label="Duration (minutes)"
        type="number"
        value={duration}
        onChange={(e) => {
          const value = parseInt(e.target.value, 10);
          if (value >= 1 || e.target.value === "") {
            setDuration(e.target.value);
          }
        }}
        fullWidth
        margin="normal"
        inputProps={{ min: 1 }}
      />

      <TimezoneSelect value={timezone} onChange={(e) => setTimezone(e.target.value)} />

      <Button
        variant="contained"
        color="primary"
        onClick={fetchSlots}
        disabled={loading}
        style={{ marginTop: 20 }}
      >
        {loading ? "Loading..." : "Get Free Slots"}
      </Button>

      {loading && <Loader />}
      {!loading && slots.length > 0 && <FreeSlots slots={slots} onSelect={setSelectedSlot} />}

      {selectedSlot && (
        <Button
          variant="contained"
          color="secondary"
          onClick={bookEvent}
          disabled={loading}
          style={{ marginTop: 20 }}
        >
          Confirm Booking
        </Button>
      )}
    </Container>
  );
};

export default BookEvent;
