import type { UserData } from "./authTypes";

export interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null
  login: (token: string) => void
  logout: () => void
  isLoading: boolean
}
