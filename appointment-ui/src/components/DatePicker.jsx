import React from 'react';
import { TextField } from '@mui/material';

const DatePicker = ({ value, onChange }) => {
  return (
    <TextField
      label="Select Date"
      type="date"
      value={value}
      onChange={onChange}
      InputLabelProps={{ shrink: true }}
      fullWidth
    />
  );
};

export default DatePicker;