import axios from "axios";

const API_BASE_URL = "http://localhost:3000/appointment";

export const fetchAvailableSlots = async (date, timezone) => {
  console.log("fetchAvailableSlots", date, timezone);
  const response = await axios.get(`${API_BASE_URL}/available_slots`, {
    params: { date, timezone },
  });
  console.log("fetchAvailableSlots response", response.data);
  return response.data;
};

export const createEvent = async (dateTime, duration, timezone) => {
  const response = await axios.post(`${API_BASE_URL}/create_event`, {
    dateTime,
    duration,
    timezone,
  });
  return response.data;
};

export const fetchBookedEvents = async (startDate, endDate) => {
  console.log("fetchBookedEvents");
  const response = await axios.get(`${API_BASE_URL}/events`, {
    params: { startDate, endDate },
  });
  return response.data.events;
};
