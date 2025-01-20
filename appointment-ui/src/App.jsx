import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Container, AppBar, Toolbar, Button } from "@mui/material";
import BookEvent from "./pages/BookEvent";
import ShowEvents from "./pages/ShowEvents";

function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            Book Appointment
          </Button>
          <Button color="inherit" component={Link} to="/events">
            Show Events
          </Button>
        </Toolbar>
      </AppBar>

      <Container>
        <Routes>
          <Route path="/" element={<BookEvent />} />
          <Route path="/events" element={<ShowEvents />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;