// src/hooks/useTheme.tsx
import * as React from "react";
import { createContext, useContext } from "react";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = React.useState<ThemeMode>(() => {
    // Get the theme from localStorage if available, otherwise default to light
    const savedMode = localStorage.getItem("themeMode") as ThemeMode;
    return savedMode || "light";
  });

  React.useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const value = {
    mode,
    setMode,
  };

  return React.createElement(ThemeContext.Provider, { value }, children);
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};