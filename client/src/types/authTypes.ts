export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface UserData {
  _id: string;
  name: string;
  email: string;
}

export interface RegisterResponse {
  msg: string;
  person: UserData;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  msg: string;
  token: string;
}

export interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}