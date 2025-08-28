// src/pages/RegisterPage.tsx
import React from "react";
import { Box } from "@mui/material";
import bg from '../assets/images/backgroundimage.jpeg'
import RegisterFeature from "../features/RegisterFeatures/RegisterFeature";

const RegisterPage: React.FC = () => {
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
      <RegisterFeature />
    </Box>
  );
};

export default RegisterPage;