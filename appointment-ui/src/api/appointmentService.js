const API_BASE_URL = 'http://localhost:3000/appointment';

export const getAvailableSlots = async (date, timezone) => {
  try {
    const response = await fetch(`${API_BASE_URL}/available_slots?date=${date}&timezone=${timezone}`);
    return response.json();
  } catch (error) {
    console.error('Error fetching available slots:', error);
    return [];
  }
};

export const createEvent = async ({ dateTime, duration }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/create_event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dateTime, duration })
    });
    return response.json();
  } catch (error) {
    console.error('Error creating event:', error);
  }
};

export const getEvents = async (startDate, endDate) => {
  try {
    const response = await fetch(`${API_BASE_URL}/events?startDate=${startDate}&endDate=${endDate}`);
    return response.json();
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};