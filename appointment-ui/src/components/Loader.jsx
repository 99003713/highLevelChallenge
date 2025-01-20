import React from "react";
import { CircularProgress, Box } from "@mui/material";

const Loader = () => {
  return (
    <Box display="flex" justifyContent="center" mt={3}>
      <CircularProgress />
    </Box>
  );
};

export default Loader;