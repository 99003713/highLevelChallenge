Appointment Booking System

********* Verify Apis ***************
go to backend folder

1.Install dependencies:
npm install

2.Start the server:
npm run start


API Endpoints
1. Get Available Slots
Endpoint: GET /appointment/available_slots
Description: Retrieves available time slots for appointments on a given date and timezone.

Request Example:
curl --location 'http://localhost:3000/appointment/available_slots?date=2025-01-25&timezone=Asia%2FKolkata'



2. Create an Event
Endpoint: POST /appointment/create_event
Description: Books an appointment for a specific date and time.

Request Example:
curl --location 'http://localhost:3000/appointment/create_event' \
--header 'Content-Type: application/json' \
--data '{
    "dateTime": "2025-01-25T08:00:00",
    "duration": 30,
    "timezone": "Asia/Kolkata"
}'

NOTE: timezone was not mentioned in the provided doc but it is required while creating en event.


3. Get Booked Events
Endpoint: GET /appointment/events
Description: Retrieves all booked appointments within a given date range.

Request Example:
curl --location 'http://localhost:3000/appointment/events?startDate=2025-01-25&endDate=2025-01-25'



********* Verify UI + Apis ***************

1 go to backend folder

1.1 Install dependencies:
npm install

1.2 Start the server:
npm run start

2 go to appointment-ui folder

2.1 Install dependencies:
npm install

2.2 Start the server:
npm run dev


now open http://localhost:5173/ to test the UI
