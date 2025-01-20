import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

const EventList = ({ events }) => {
  return (
    <List>
      {events.length === 0 ? (
        <Typography>No events found</Typography>
      ) : (
        events.map((event, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`Event at: ${new Date(event.dateTime).toLocaleString()}`}
              secondary={`Duration: ${event.duration} mins`}
            />
          </ListItem>
        ))
      )}
    </List>
  );
};

export default EventList;