import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Alert,
  TextField,
  Button,
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
import { z } from "zod";

// ✅ Frontend schema validation
const registerSchema = (t: (key: string) => string) =>
  z.object({
    username: z.string().min(3, t("errors.username_min")),
    email: z.string().email(t("errors.email_invalid")),
    password: z.string().min(3, t("errors.password_min")),
  });

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface RegisterError {
  message?: string;
  errors?: Record<string, string | string[]>;
}

const RegisterFeature: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { mutate: registerMutation, isPending, isSuccess } = useRegister();

  const [formData, setFormData] = useState<RegisterData>({
    username: "",
    email: "",
    password: "",
  });

  const [localErrors, setLocalErrors] = useState<
    Partial<Record<keyof RegisterData, string>>
  >({});
  const [backendFieldErrors, setBackendFieldErrors] = useState<
    Partial<Record<keyof RegisterData, string>>
  >({});
  const [globalBackendErrors, setGlobalBackendErrors] = useState<string[]>([]);

  const isRTL = i18n.language === "ar";
  const schema = registerSchema(t);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setLocalErrors((prev) => {
      const updated = { ...prev };
      delete updated[name as keyof RegisterData];
      return updated;
    });

    setBackendFieldErrors((prev) => {
      const updated = { ...prev };
      delete updated[name as keyof RegisterData];
      return updated;
    });
  };

  const extractBackendErrors = (err: unknown) => {
    const globalErrors: string[] = [];
    const fieldErrors: Partial<Record<keyof RegisterData, string>> = {};

    if (
      err &&
      typeof err === "object" &&
      "response" in err &&
      err.response &&
      typeof err.response === "object" &&
      "data" in err.response
    ) {
      const responseData = (err.response as { data: RegisterError }).data;

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
          const field = key as keyof RegisterData;
          if (typeof val === "string") {
            fieldErrors[field] = t(`errors.${val}`, val);
          } else if (Array.isArray(val) && val.length > 0) {
            fieldErrors[field] = t(`errors.${val[0]}`, val[0]);
          }
        });
      }

      if (globalErrors.length === 0 && Object.keys(fieldErrors).length === 0) {
        globalErrors.push(
          t("errors.unknown_error", "An unexpected error occurred.")
        );
      }
    } else {
      globalErrors.push(t("errors.network_error", "A network error occurred."));
    }

    return { globalErrors, fieldErrors };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegisterData, string>> = {};
      result.error.errors.forEach((err) => {
        const path = err.path[0] as keyof RegisterData;
        if (!fieldErrors[path]) {
          fieldErrors[path] = err.message;
        }
      });
      setLocalErrors(fieldErrors);
      return;
    }

    setLocalErrors({});
    setGlobalBackendErrors([]);
    setBackendFieldErrors({});

    registerMutation(formData, {
      onSuccess: () => {
        setTimeout(() => navigate({ to: "/login" }), 2000);
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

        {/* ✅ Success Alert */}
        {isSuccess && (
          <Alert
            severity="success"
            sx={{ width: "100%", mb: 2, borderRadius: 1 }}
          >
            {t("auth.registrationSuccess")}
          </Alert>
        )}

        {/* ✅ Global Backend Errors */}
        {globalBackendErrors.map((err, idx) => (
          <Alert
            key={idx}
            severity="error"
            sx={{ width: "100%", mb: 2, borderRadius: 1 }}
          >
            {err}
          </Alert>
        ))}

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          {/* Username */}
          <TextField
            margin="normal"
            fullWidth
            label={t("auth.username")}
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={Boolean(localErrors.username || backendFieldErrors.username)}
            helperText={localErrors.username || backendFieldErrors.username}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          {/* Email */}
          <TextField
            margin="normal"
            fullWidth
            label={t("auth.email")}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={Boolean(localErrors.email || backendFieldErrors.email)}
            helperText={localErrors.email || backendFieldErrors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          {/* Password */}
          <TextField
            margin="normal"
            fullWidth
            label={t("auth.password")}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={Boolean(localErrors.password || backendFieldErrors.password)}
            helperText={localErrors.password || backendFieldErrors.password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          {/* Submit */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isPending}
            sx={{ mt: 3, mb: 2 }}
          >
            {isPending ? <CircularProgress size={20} /> : t("auth.signUp")}
          </Button>

          {/* Login link */}
          <Typography variant="body2" align="center">
            {t("auth.haveAccount")}{" "}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate({ to: "/login" })}
            >
              {t("auth.signIn")}
            </Link>
          </Typography>
        </form>
      </Paper>
    </Container>
  );
};

export default RegisterFeature;
