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
import { z } from "zod";

// ✅ Schema: only frontend validation
const loginSchema = (t: (key: string) => string) =>
  z.object({
    email: z
      .string()
      .min(1, t("auth.errors.emailRequired"))
      .email(t("auth.errors.invalidEmail")),
    password: z
      .string()
      .min(1, t("auth.errors.passwordRequired"))
      .min(6, t("auth.errors.passwordMin")),
  });

interface LoginError {
  message?: string;
  errors?: Record<string, string | string[]>;
}

interface LoginData {
  email: string;
  password: string;
}

interface ExtractedBackendErrors {
  globalErrors: string[];
  fieldErrors: Partial<Record<keyof LoginData, string>>;
}

const LoginFeature: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [localErrors, setLocalErrors] = useState<
    Partial<Record<keyof LoginData, string>>
  >({});
  const [backendFieldErrors, setBackendFieldErrors] = useState<
    Partial<Record<keyof LoginData, string>>
  >({});
  const [globalBackendErrors, setGlobalBackendErrors] = useState<string[]>([]);

  const { mutate: loginMutation, isPending, isSuccess } = useLogin();
  const navigate = useNavigate();
  const { login } = useAuth();

  const isRTL = i18n.language === "ar" || i18n.language === "he";
  const schema = loginSchema(t);

  // ✅ Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (localErrors[name as keyof LoginData]) {
      setLocalErrors((prev) => {
        const updated = { ...prev };
        delete updated[name as keyof LoginData];
        return updated;
      });
    }
    if (backendFieldErrors[name as keyof LoginData]) {
      setBackendFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[name as keyof LoginData];
        return updated;
      });
    }
  };

  const handleBlur = (field: keyof LoginData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // ✅ Collect and categorize backend errors
  const extractBackendErrors = (err: unknown): ExtractedBackendErrors => {
    const globalErrors: string[] = [];
    const fieldErrors: Partial<Record<keyof LoginData, string>> = {};

    if (
      err &&
      typeof err === "object" &&
      "response" in err &&
      err.response &&
      typeof err.response === "object" &&
      "data" in err.response
    ) {
      const responseData = (err.response as { data: LoginError }).data;

      if (
        responseData.message &&
        (!responseData.errors || Object.keys(responseData.errors).length === 0)
      ) {
        globalErrors.push(
          t(`errors.${responseData.message}`, responseData.message)
        );
      }

      if (responseData.errors) {
        Object.entries(responseData.errors).forEach(([key, val]) => {
          const field = key as keyof LoginData;
          if (typeof val === "string") {
            fieldErrors[field] = t(`errors.${val}`, val);
          } else if (Array.isArray(val) && val.length > 0) {
            fieldErrors[field] = t(`errors.${val[0]}`, val[0]);
          }
        });
      }

      if (
        globalErrors.length === 0 &&
        Object.keys(fieldErrors).length === 0
      ) {
        globalErrors.push(
          t("errors.unknown_error", "An unexpected error occurred.")
        );
      }
    } else {
      globalErrors.push(
        t("errors.network_error", "A network error occurred.")
      );
    }
    return { globalErrors, fieldErrors };
  };

  // ✅ Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginData, string>> = {};
      result.error.errors.forEach((err) => {
        const path = err.path[0] as keyof LoginData;
        fieldErrors[path] = err.message;
      });
      setLocalErrors(fieldErrors);
      return;
    }

    setLocalErrors({});
    setGlobalBackendErrors([]);
    setBackendFieldErrors({});

    loginMutation(formData, {
      onSuccess: (data) => {
        login(data.token);
        navigate({ to: "/" });
      },
      onError: (err) => {
        const { globalErrors, fieldErrors } = extractBackendErrors(err);
        setGlobalBackendErrors(globalErrors);
        setBackendFieldErrors(fieldErrors);
      },
    });
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

        {isSuccess && (
          <Alert
            severity="success"
            sx={{ width: "100%", mb: 2, borderRadius: 1 }}
          >
            {t("auth.loginSuccess")}
          </Alert>
        )}

        {globalBackendErrors.length > 0 && (
          <Alert
            severity="error"
            sx={{ width: "100%", mb: 2, borderRadius: 1 }}
          >
            {globalBackendErrors.map((msg, idx) => (
              <div key={idx}>{msg}</div>
            ))}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
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
            error={Boolean(
              touched.email && (localErrors.email || backendFieldErrors.email)
            )}
            helperText={
              (touched.email &&
                (localErrors.email || backendFieldErrors.email)) ||
              ""
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
            FormHelperTextProps={{
              sx: { textAlign: isRTL ? "right" : "left" },
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label={t("auth.password")}
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            onBlur={() => handleBlur("password")}
            error={Boolean(
              touched.password &&
                (localErrors.password || backendFieldErrors.password)
            )}
            helperText={
              (touched.password &&
                (localErrors.password || backendFieldErrors.password)) ||
              ""
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
            }}
            FormHelperTextProps={{
              sx: { textAlign: isRTL ? "right" : "left" },
            }}
          />

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
