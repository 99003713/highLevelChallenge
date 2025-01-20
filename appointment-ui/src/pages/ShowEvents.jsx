import React, { useState } from "react";
import { Container, Typography, Alert, Button, TextField } from "@mui/material";
import Loader from "../components/Loader";
import EventList from "../components/EventList";
import { fetchBookedEvents } from "../api/appointmentService";

const ShowEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchEvents = async () => {
    if (!startDate || !endDate) {
      setMessage("Please select both start and end dates.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const data = await fetchBookedEvents(startDate, endDate);
      setEvents(data);
    } catch (error) {
      console.error("Failed to load events", error);
      setMessage("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Upcoming Events
      </Typography>

      {message && <Alert severity="error">{message}</Alert>}

      <TextField
        label="Start Date"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
        margin="normal"
      />
      <TextField
        label="End Date"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
        margin="normal"
      />

      <Button
        variant="contained"
        color="primary"
        onClick={fetchEvents}
        disabled={loading}
        style={{ marginTop: 20 }}
      >
        {loading ? "Loading..." : "Fetch Events"}
      </Button>

      {loading && <Loader />}
      {!loading && events.length > 0 && <EventList events={events} />}
    </Container>
  );
};

export default ShowEvents;