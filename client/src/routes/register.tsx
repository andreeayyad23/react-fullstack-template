import { createFileRoute, redirect } from '@tanstack/react-router'
import RegisterPage from '../pages/RegisterPage'

export const Route = createFileRoute('/register')({
  beforeLoad: () => {
    const token = localStorage.getItem('token');
    if (token) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: RegisterPage,
})