// src/services/authApi.ts
import axios from "axios";
import type {
  RegisterData,
  RegisterResponse,
  LoginData,
  LoginResponse,
  UserData,
} from "../types/authTypes";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authApi = {
  register: async (data: RegisterData): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>(
      "/api/v1/auth/register",
      data
    );
    return response.data;
  },

  login: async (data: LoginData): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      "/api/v1/auth/login",
      data
    );
    return response.data;
  },

  getCurrentUser: async (): Promise<UserData> => {
    const response = await apiClient.get<UserData>("/api/v1/auth/me");
    return response.data;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem("token");
    return Promise.resolve();
  },
};
