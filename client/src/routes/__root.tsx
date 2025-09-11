// src/root.tsx

import { createRootRoute, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import { useAuth } from "../hooks/Authentication/useAuth";
import { AuthProvider } from "../context/Authentication/AuthProvider";
import NotFoundPage from "../components/404Page/NotFoundPage";
import SidebarLayout from "../components/SideBar/SideBarLayout";

const PUBLIC_ROUTES = ["/login", "/register"];

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    const token = localStorage.getItem("token");

    if (!token && !PUBLIC_ROUTES.includes(location.pathname)) {
      throw redirect({ to: "/login" });
    }
  },
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

function RootLayout() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { isAuthenticated, logout } = useAuth();
  const { location } = useRouterState();
  const pathname = location.pathname;

  // Don't show navbar/layout on public routes
  const showLayout = isAuthenticated && !PUBLIC_ROUTES.includes(pathname);

  return showLayout ? (
    <SidebarLayout
      brand="Your App Name"
      isAuthenticated={isAuthenticated}
      onLogout={logout}
    >
      <Outlet />
    </SidebarLayout>
  ) : (
    <Outlet />
  );
}