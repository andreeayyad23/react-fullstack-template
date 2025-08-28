import { createRootRoute, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import SharedNavBar from "../components/NavBar/SharedNavBar";
import { useAuth } from "../hooks/Authentication/useAuth";
import { AuthProvider } from "../context/Authentication/AuthProvider";
import NotFoundPage from "../components/404Page/NotFoundPage"; // <-- import your insane 404 page

const PUBLIC_ROUTES = ['/login', '/register'];

export const Route = createRootRoute({
  // Global guard runs before any child route loads
  beforeLoad: ({ location }) => {
    const token = localStorage.getItem('token');

    if (!token && !PUBLIC_ROUTES.includes(location.pathname)) {
      throw redirect({ to: '/login' });
    }
  },
  component: RootLayout,
  notFoundComponent: NotFoundPage, // <-- this fixes the TanStack Router warning
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
  const router = useRouterState();
  const pathname = router.location.pathname;

  const showNavBar = pathname !== '/login' && pathname !== '/register';

  return (
    <>
      {showNavBar && (
        <SharedNavBar
          brand="AyyadApp"
          onLogout={logout}
          isAuthenticated={isAuthenticated}
        />
      )}
      <Outlet />
    </>
  );
}
