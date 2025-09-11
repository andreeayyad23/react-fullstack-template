// src/components/Layout/NavbarLayout.tsx
import { Outlet } from "@tanstack/react-router";
import Box from "@mui/material/Box";

interface SideBarLayoutProps {
  brand: string;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export default function SideBarLayout({
  brand,
  isAuthenticated,
  onLogout,
}: SideBarLayoutProps) {
  return (
    <>
      <SideBarLayout
        brand={brand}
        isAuthenticated={isAuthenticated}
        onLogout={onLogout}
      />
      <Box
        component="main"
        sx={{
          pt: 8, // Push content below AppBar (height ~64px + margin)
          pb: 4,
          px: { xs: 2, md: 3 },
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Outlet />
      </Box>
    </>
  );
}