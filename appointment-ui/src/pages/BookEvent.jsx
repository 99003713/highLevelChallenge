import React, { useState } from "react";
import { Container, Button, TextField, Typography, Alert } from "@mui/material";
import CustomDatePicker from "../components/DatePicker";
import TimezoneSelect from "../components/TimezoneSelect";
import FreeSlots from "../components/FreeSlots";
import Loader from "../components/Loader";
import axios from "axios";
import dayjs from "dayjs";

const BookEvent = () => {
  const [date, setDate] = useState(dayjs());
  const [duration, setDuration] = useState(30);
  const [timezone, setTimezone] = useState("US/Eastern");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchSlots = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.get("http://localhost:3000/appointment/available_slots", {
        params: { date: date.format("YYYY-MM-DD"), timezone },
      });
      setSlots(response.data);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to fetch slots." });
    } finally {
      setLoading(false);
    }
  };

  const bookEvent = async () => {
    if (!selectedSlot) return alert("Please select a time slot.");
    setLoading(true);

    try {
      await axios.post("http://localhost:3000/appointment/create_event", {
        dateTime: selectedSlot,
        duration: parseInt(duration),
      });
      setMessage({ type: "success", text: "Event booked successfully!" });
      setSlots(slots.filter((slot) => slot !== selectedSlot)); // Remove booked slot
    } catch (error) {
      setMessage({ type: "error", text: "Error booking event. Slot may be taken." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Book an Appointment
      </Typography>

      {message.text && <Alert severity={message.type}>{message.text}</Alert>}

      <CustomDatePicker label="Select Date" value={date} onChange={setDate} />
      <TextField
        label="Duration (minutes)"
        type="number"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TimezoneSelect value={timezone} onChange={(e) => setTimezone(e.target.value)} />

      <Button variant="contained" color="primary" onClick={fetchSlots} style={{ marginTop: 20 }}>
        Get Free Slots
      </Button>

      {loading ? <Loader /> : slots.length > 0 && <FreeSlots slots={slots} onSelect={setSelectedSlot} />}

      {selectedSlot && (
        <Button variant="contained" color="secondary" onClick={bookEvent} style={{ marginTop: 20 }}>
          Confirm Booking
        </Button>
      )}
    </Container>
  );
};

export default BookEvent;