// src/store/userStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  user: unknown | null;
  login: (userData: unknown) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      
      login: (userData) => set({ 
        isAuthenticated: true, 
        user: userData 
      }),
      
      logout: () => {
        // Clear any stored tokens or user data
        set({ 
          isAuthenticated: false, 
          user: null 
        });
        
        // Clear localStorage
        localStorage.removeItem('token');
      },
      
      checkAuth: () => {
        // Implement your auth check logic here
        // For example, check if token exists and is valid
        const { isAuthenticated } = get();
        return isAuthenticated;
      },
    }),
    {
      name: 'auth-storage', // unique name for localStorage
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated, 
        user: state.user 
      }),
    }
  )
);

export default useAuthStore;