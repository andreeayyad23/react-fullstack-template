// src/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "../features/DashboardFeatures";

export const Route = createFileRoute("/")({
  component: Dashboard,
});
