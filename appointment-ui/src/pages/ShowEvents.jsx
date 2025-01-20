import React, { useState } from "react";
import { Container, Typography, Alert, Button, TextField, Box } from "@mui/material";
import dayjs from "dayjs";
import Loader from "../components/Loader";
import EventList from "../components/EventList";
import { fetchBookedEvents } from "../api/appointmentService";

const ShowEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const validateDates = () => {
    const now = dayjs();
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (!startDate || !endDate) {
      setMessage("Please select both start and end dates.");
      return false;
    }

    if (start.isBefore(now, "day")) {
      setMessage("Start date cannot be in the past.");
      return false;
    }

    if (start.isAfter(end)) {
      setMessage("Start date must be earlier than the end date.");
      return false;
    }

    return true;
  };

  const fetchEvents = async () => {
    if (!validateDates()) return;

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
      <Typography variant="h4" gutterBottom sx={{ marginTop: '16px' }}>
        Upcoming Events
      </Typography>

      {message && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Box display="flex" flexDirection="column" alignItems="flex-start" gap={2}>
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ width: '250px' }} // Adjust the width as needed
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ width: '250px' }} // Adjust the width as needed
        />
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={fetchEvents}
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? "Loading..." : "Fetch Events"}
      </Button>

      {loading && <Loader />}
      {!loading && events.length > 0 && <EventList events={events} />}
    </Container>
  );
};

export default ShowEvents;