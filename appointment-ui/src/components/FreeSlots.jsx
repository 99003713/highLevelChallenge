import React from "react";
import { Button, Grid, Box } from "@mui/material";

const FreeSlots = ({ slots, onSelect }) => {
  return (
    <Box mt={2}>
      <Grid container spacing={2}>
        {slots.map((slot) => (
          <Grid item xs={6} sm={4} md={3} key={slot}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => onSelect(slot)}
            >
              {new Date(slot).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FreeSlots;