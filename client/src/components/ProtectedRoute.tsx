// src/components/ProtectedRoute.tsx
import { redirect } from "@tanstack/react-router";

export function protectedRouteGuard() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw redirect({ to: "/login" });
  }
}
