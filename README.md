Appointment Booking System

1.Install dependencies:
npm install

2.Start the server:
npm run start


API Endpoints
1. Get Available Slots
Endpoint: GET /appointment/available_slots
Description: Retrieves available time slots for appointments on a given date and timezone.

Request Example:
curl --location 'http://localhost:3000/appointment/available_slots?date=2025-01-25&timezone=US%2FEastern'



2. Create an Event
Endpoint: POST /appointment/create_event
Description: Books an appointment for a specific date and time.

Request Example:
curl --location 'http://localhost:3000/appointment/create_event' \
--header 'Content-Type: application/json' \
--data '{
    "dateTime": "2025-01-23T08:00:00",
    "duration": 30
}'



3. Get Booked Events
Endpoint: GET /appointment/events
Description: Retrieves all booked appointments within a given date range.

Request Example:
curl --location 'http://localhost:3000/appointment/events?startDate=2025-01-25&endDate=2025-01-25'
