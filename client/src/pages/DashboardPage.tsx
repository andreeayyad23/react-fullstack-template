// src/pages/LoginPage.tsx
import React from "react";
import { Box } from "@mui/material";
import bg from '../assets/images/backgroundimage.jpeg'
import Dashboard from "../features/DashboardFeatures";

const DashboardPage: React.FC = () => {
  return (
    <Box
      sx={{
       position: 'fixed',        
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
      }}  
    >
      <Dashboard />
    </Box>
  );
};

export default DashboardPage;