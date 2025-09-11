// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./styles/global.css";
import "./i18n";
import CustomThemeProvider from "./components/ThemeProvider/ThemeProvider";

const queryClient = new QueryClient();

// Update the router context with the queryClient
router.update({
  context: {
    ...router.options.context,
    queryClient,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CustomThemeProvider>
        <RouterProvider router={router} />
      </CustomThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);