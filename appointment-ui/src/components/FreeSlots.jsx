import React from 'react';
import { Button, Stack } from '@mui/material';

const FreeSlots = ({ slots, onSelect }) => {
  return (
    <Stack direction="row" spacing={2} flexWrap="wrap">
      {slots.map((slot) => (
        <Button key={slot} variant="contained" onClick={() => onSelect(slot)}>
          {new Date(slot).toLocaleTimeString()}
        </Button>
      ))}
    </Stack>
  );
};

export default FreeSlots;