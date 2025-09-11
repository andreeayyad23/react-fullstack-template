// src/components/ThemeProvider/ThemeProvider.tsx
import * as React from "react";
import {
  ThemeProvider,
  createTheme,
} from "@mui/material/styles";
import { ThemeProvider as CustomThemeContextProvider, useTheme } from "../../hooks/useTheme";

// Create a custom theme with light and dark modes
const getDesignTokens = (mode: "light" | "dark") => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // Light mode palette
          primary: {
            main: "#11B04B",
          },
          secondary: {
            main: "#00C853",
          },
          background: {
            default: "#f8f9fa",
            paper: "#ffffff",
          },
        }
      : {
          // Dark mode palette
          primary: {
            main: "#11B04B",
          },
          secondary: {
            main: "#00C853",
          },
          background: {
            default: "#121212",
            paper: "#1e1e1e",
          },
        }),
  },
});

// Create a wrapper component that provides the theme based on the mode
function ThemedApp({ children }: { children: React.ReactNode }) {
  const { mode } = useTheme();
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

interface Props {
  children: React.ReactNode;
}

export default function CustomThemeProvider({ children }: Props) {
  return (
    <CustomThemeContextProvider>
      <ThemedApp>{children}</ThemedApp>
    </CustomThemeContextProvider>
  );
}