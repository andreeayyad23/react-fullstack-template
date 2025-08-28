// src/features/auth/components/LoginForm.tsx
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  Link,
} from "@mui/material";
import { Email as EmailIcon, Lock as LockIcon } from "@mui/icons-material";
import { useNavigate } from "@tanstack/react-router";
import { useLogin } from "../../hooks/Authentication/useAuthMutation";
import { useAuth } from "../../hooks/Authentication/useAuth";
import { useTranslation } from "react-i18next";

// 🔽 Match backend error structure
interface LoginError {
  message?: string;
  errors?: {
    email?: string;
    password?: string;
  };
}

interface LoginData {
  email: string;
  password: string;
}

const LoginFeature: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [showPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const { mutate: loginMutation, isPending, error, isSuccess } = useLogin();
  const navigate = useNavigate();
  const { login } = useAuth();

  const isRTL = i18n.language === "ar" || i18n.language === "he";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      email: true,
      password: true,
    });
    loginMutation(formData, {
      onSuccess: (data) => {
        login(data.token);
        navigate({ to: "/" });
      },
    });
  };

  const getBackendError = (field: keyof LoginData): string | undefined => {
    let backendError: LoginError | undefined;
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "data" in error.response
    ) {
      backendError = (error.response as { data: LoginError }).data;
    }
    return backendError?.errors?.[field];
  };

  const showError = (field: keyof LoginData): boolean => {
    return Boolean(touched[field] && getBackendError(field));
  };

  const getErrorMessage = (field: keyof LoginData): string | undefined => {
    return getBackendError(field);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={6}
        sx={{
          padding: { xs: 3, sm: 4 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          direction: isRTL ? "rtl" : "ltr",
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          fontWeight="bold"
          sx={{ mb: 3 }}
        >
          {t("auth.signIn")}
        </Typography>

        {/* Success Alert */}
        {isSuccess && (
          <Alert
            severity="success"
            sx={{ width: "100%", mb: 2, borderRadius: 1 }}
          >
            {t("auth.loginSuccess")}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          {/* Email Field */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label={t("auth.email")}
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur("email")}
            error={showError("email")}
            helperText={showError("email") ? getErrorMessage("email") : ""}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          {/* Password Field */}
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label={t("auth.password")}
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            onBlur={() => handleBlur("password")}
            error={showError("password")}
            helperText={
              showError("password") ? getErrorMessage("password") : ""
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isPending}
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 1,
            }}
          >
            {isPending ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, ml: 1 }} />
                {t("auth.signingIn")}
              </>
            ) : (
              t("auth.signIn")
            )}
          </Button>

          {/* Register Link */}
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {t("auth.noAccount")}{" "}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate({ to: "/register" })}
                sx={{ fontWeight: 500 }}
              >
                {t("auth.signUp")}
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginFeature;
