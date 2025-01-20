import React from "react";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";

const timezones = [
  { value: "America/Los_Angeles", label: "America/Los_Angeles (GMT-7:00)" },
  { value: "US/Eastern", label: "US/Eastern (GMT-4:00)" },
  { value: "Europe/London", label: "Europe/London (GMT+1:00)" },
  { value: "Asia/Kolkata", label: "Asia/Kolkata (GMT+5:30)" },
  { value: "Australia/Sydney", label: "Australia/Sydney (GMT+10:00)" },
  { value: "Pacific/Auckland", label: "Pacific/Auckland (GMT+12:00)" },
  { value: "UTC", label: "UTC (GMT+0:00)" },
  { value: "Etc/UTC", label: "Etc/UTC (GMT+0:00)" },
  { value: "Etc/GMT+12", label: "Etc/GMT+12 (GMT-12:00)" },
];

const TimezoneSelect = ({ value, onChange }) => {
  return (
    <FormControl fullWidth margin="normal">
      <InputLabel id="timezone-label">Timezone</InputLabel>
      <Select
        labelId="timezone-label"
        value={value}
        onChange={onChange}
        label="Timezone"
      >
        {timezones.map((tz) => (
          <MenuItem key={tz.value} value={tz.value}>
            {tz.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TimezoneSelect;
