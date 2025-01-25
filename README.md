Appointment Booking System

Prerequisites:
Since this repository is publicly available, the Firebase key is not included in the serviceAccount.json file.
Action Required: Generate a new Firebase service account key, add it to the serviceAccount.json file, and create the events collection in Firestore before proceeding.


Backend Setup and API Verification
Steps to Set Up Backend and Verify APIs:

# Step 1: Navigate to the backend folder
cd backend

# Step 2: Install dependencies
npm install

# Step 3: Start the server
npm run start

API Endpoints:
1. Get Available Slots
Endpoint: GET /appointment/available_slots
Description: Retrieves available time slots for appointments on a given date and timezone.
Request Example:
curl --location 'http://localhost:3000/appointment/available_slots?date=2025-01-25&timezone=Asia%2FKolkata'


2. Create an Event
Endpoint: POST /appointment/create_event
Description: Books an appointment for a specific date and time.
Note: The timezone parameter is required but not mentioned in the original documentation.
Request Example:
curl --location 'http://localhost:3000/appointment/create_event' \
--header 'Content-Type: application/json' \
--data '{
  "dateTime": "2025-01-25T08:00:00",
  "duration": 30,
  "timezone": "Asia/Kolkata"
}'


3. Get Booked Events
Endpoint: GET /appointment/events
Description: Retrieves all booked appointments within a specified date range.
Request Example:
curl --location 'http://localhost:3000/appointment/events?startDate=2025-01-25&endDate=2025-01-25'


Frontend Setup and UI Verification
Steps to Set Up and Test UI:
# Step 1: Navigate to the backend folder (if not already running)
cd backend

# Step 2: Install dependencies (if not done already)
npm install

# Step 3: Start the backend server
npm run start

# Step 4: Navigate to the appointment-ui folder
cd ../appointment-ui

# Step 5: Install dependencies
npm install

# Step 6: Start the frontend server
npm run dev


Access the UI:
Open http://localhost:5173/ in your browser to test the appointment booking UI.


