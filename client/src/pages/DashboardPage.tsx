// src/pages/DashboardPage.tsx

import React from "react";
import { Box } from "@mui/material";
import Dashboard from "../features/DashboardFeatures";

const DashboardPage: React.FC = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Dashboard />
    </Box>
  );
};

export default DashboardPage;