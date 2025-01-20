import React, { useState } from "react";
import { Container, Button, Typography, Alert } from "@mui/material";
import CustomDatePicker from "../components/DatePicker";
import EventList from "../components/EventList";
import Loader from "../components/Loader";
import axios from "axios";
import dayjs from "dayjs";

const ShowEvents = () => {
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchEvents = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.get("http://localhost:3000/appointment/events", {
        params: {
          startDate: startDate.format("YYYY-MM-DD"),
          endDate: endDate.format("YYYY-MM-DD"),
        },
      });
      setEvents(response.data);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to fetch events." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Show Booked Events
      </Typography>

      {message.text && <Alert severity={message.type}>{message.text}</Alert>}

      <CustomDatePicker label="Start Date" value={startDate} onChange={setStartDate} />
      <CustomDatePicker label="End Date" value={endDate} onChange={setEndDate} />

      <Button variant="contained" color="primary" onClick={fetchEvents} style={{ marginTop: 20 }}>
        Get Events
      </Button>

      {loading ? <Loader /> : events.length > 0 && <EventList events={events} />}
    </Container>
  );
};

export default ShowEvents;