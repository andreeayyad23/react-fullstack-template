import { createFileRoute, redirect } from '@tanstack/react-router';
import LoginPage from '../pages/LoginPage';

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    const token = localStorage.getItem('token');
    if (token) {
      throw redirect({
        to: '/',
      });
    }
  },
  component: LoginPage,
});
