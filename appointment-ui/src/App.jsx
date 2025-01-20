import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Container, Typography } from "@mui/material";
import BookEvent from "./pages/BookEvent";
import ShowEvents from "./pages/ShowEvents";

function Layout({ children }) {
  return (
    <>
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
      <Container>{children}</Container>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <BookEvent />
            </Layout>
          }
        />
        <Route
          path="/events"
          element={
            <Layout>
              <ShowEvents />
            </Layout>
          }
        />
        <Route
          path="*"
          element={
            <Layout>
              <Typography variant="h5" textAlign="center" mt={3}>
                Page Not Found
              </Typography>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;