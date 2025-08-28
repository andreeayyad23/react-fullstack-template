// src/hooks/useAuthMutation.ts
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../services/authApi";
import type { LoginData, RegisterData } from "../../types/authTypes";

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginData) => authApi.login(data),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
  });
};
