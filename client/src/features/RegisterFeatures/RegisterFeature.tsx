// src/features/auth/components/RegisterForm.tsx
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
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { useNavigate } from "@tanstack/react-router";
import { useRegister } from "../../hooks/Authentication/useAuthMutation";
import { useTranslation } from "react-i18next";

// 🔽 Match backend error structure
interface RegisterError {
  message?: string;
  errors?: {
    username?: string;
    email?: string;
    password?: string;
  };
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

const RegisterFeature: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState<RegisterData>({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const { mutate: register, isPending, error, isSuccess } = useRegister();
  const navigate = useNavigate();

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
      username: true,
      email: true,
      password: true,
    });
    register(formData, {
      onSuccess: () => {
        navigate({ to: "/login" });
      },
    });
  };

  // 🔽 Get backend error for a field
  const getBackendError = (field: keyof RegisterData): string | undefined => {
    let backendError: RegisterError | undefined;
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "data" in error.response
    ) {
      backendError = (error.response as { data: RegisterError }).data;
    }
    return backendError?.errors?.[field];
  };

  const showError = (field: keyof RegisterData): boolean => {
    return Boolean(touched[field] && getBackendError(field));
  };

  const getErrorMessage = (field: keyof RegisterData): string | undefined => {
    return getBackendError(field);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={6}
        sx={{
          marginTop: 8,
          padding: { xs: 3, sm: 4 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 2,
          boxShadow: 3,
          direction: isRTL ? "rtl" : "ltr",
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          fontWeight="bold"
          sx={{ mb: 3 }}
        >
          {t("auth.createAccount")}
        </Typography>

        {/* Success Alert */}
        {isSuccess && (
          <Alert
            severity="success"
            sx={{ width: "100%", mb: 2, borderRadius: 1 }}
          >
            {t("auth.registrationSuccess")}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          {/* Username Field */}
          {/* Username Field */}
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label={t("auth.username")}
            name="username"
            autoComplete="username"
            autoFocus
            value={formData.username}
            onChange={handleChange}
            onBlur={() => handleBlur("username")}
            error={showError("username")}
            helperText={
              showError("username") ? getErrorMessage("username") : ""
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

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
            autoComplete="new-password"
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
                {t("auth.creatingAccount")}
              </>
            ) : (
              t("auth.createAccount")
            )}
          </Button>

          {/* Sign In Link */}
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              {t("auth.alreadyHaveAccount")}{" "}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate({ to: "/login" })}
                sx={{ fontWeight: 500 }}
              >
                {t("auth.signIn")}
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterFeature;
