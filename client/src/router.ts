// src/router.ts
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

// Create router instance
export const router = createRouter({
  routeTree,
  scrollRestoration: true,
})

// Augment the TanStack React Router type
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
