import React from 'react';
import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const timezones = [
  'America/Los_Angeles',
  'US/Eastern',
  'Europe/London',
  'Asia/Kolkata',
  'Australia/Sydney'
];

const TimezoneSelect = ({ value, onChange }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>Timezone</InputLabel>
      <Select value={value} onChange={onChange}>
        {timezones.map((tz) => (
          <MenuItem key={tz} value={tz}>
            {tz}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TimezoneSelect;