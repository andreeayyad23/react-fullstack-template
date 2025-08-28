import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
  Tooltip,
  Container,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme, // Added to use theme spacing
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import TranslateIcon from "@mui/icons-material/Translate";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout"; // Renamed to avoid conflict
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";

interface SharedNavBarProps {
  brand: string; // Still here, but t("brand") is used in this refactor
  isAuthenticated: boolean;
  onLogout: () => void;
}

const languages = [
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
];

export default function SharedNavBar({
  isAuthenticated,
  onLogout,
}: SharedNavBarProps) {
  const { t } = useTranslation();
  const theme = useTheme(); // Initialize theme
  const [anchorElLang, setAnchorElLang] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentLang = i18n.language;

  const handleOpenLangMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElLang(event.currentTarget);
  };

  const handleCloseLangMenu = (langCode?: string) => {
    if (langCode) {
      i18n.changeLanguage(langCode);
      document.dir = langCode === "ar" ? "rtl" : "ltr";
    }
    setAnchorElLang(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Drawer content
  const drawer = (
    <Box
      sx={{ width: 280 }}
      role="presentation"
      onClick={handleDrawerToggle}
      onKeyDown={handleDrawerToggle} // Added for accessibility
    >
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          variant="h6"
          noWrap
          sx={{
            fontWeight: 700,
            color: "primary.main",
            textDecoration: "none",
            flexGrow: 1,
          }}
        >
          {t("brand")}
        </Typography>
        {isAuthenticated && (
          <AccountCircle color="action" sx={{ fontSize: "1.75rem" }} />
        )}
      </Box>
      <Divider />
      <List>
        {/* Language Switcher in Drawer */}
        <ListItemButton onClick={handleOpenLangMenu} sx={{ pl: theme.spacing(2) }}>
          <ListItemIcon>
            <TranslateIcon />
          </ListItemIcon>
          <ListItemText primary={t("change_language")} />
        </ListItemButton>
        {/* You can add more navigation links here */}
        {/* <ListItemButton>
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary={t("home")} />
        </ListItemButton> */}
      </List>
      <Divider />
      {isAuthenticated && (
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="contained" // Changed to contained for more prominence
            startIcon={<LogoutIcon />}
            onClick={() => {
              handleDrawerToggle();
              onLogout();
            }}
            sx={{
              backgroundColor: theme.palette.error.main, // Use error color for logout
              "&:hover": {
                backgroundColor: theme.palette.error.dark,
              },
            }}
          >
            {t("logout")}
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          background: "linear-gradient(99deg, #11B04B 0%, #0a7934 100%)", // Slightly adjusted gradient
          boxShadow: 3,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: 64 }}>
            {/* Mobile Menu Icon */}
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="open drawer"
                color="inherit"
                onClick={handleDrawerToggle}
                sx={{
                  mr: 1,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>

            {/* Brand - Desktop & Mobile */}
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                flexGrow: 1, // Allows brand to take available space
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
                fontSize: { xs: "1.25rem", md: "1.5rem" },
              }}
            >
              {t("brand")}
            </Typography>

            {/* Desktop Navigation Links (if any) could go here */}
            {/* <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                <Button sx={{ my: 2, color: "white", display: "block" }}>
                  {t("home")}
                </Button>
            </Box> */}

            {/* Right Side Actions - Always visible (Language + User/Logout) */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, md: 2 }, // Adjust gap for smaller screens
              }}
            >
              {/* Language Switcher */}
              <Tooltip title={t("change_language")}>
                <IconButton
                  onClick={handleOpenLangMenu}
                  sx={{
                    color: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                    },
                  }}
                >
                  <TranslateIcon />
                </IconButton>
              </Tooltip>

              {/* User Indicator / Profile (if authenticated and not just logout) */}
              {isAuthenticated && (
                <Tooltip title={t("profile")}>
                  <IconButton
                    color="inherit"
                    // If you want a user menu, uncomment the next line and add handleOpenUserMenu
                    // onClick={handleOpenUserMenu}
                    sx={{
                      display: { xs: "none", md: "flex" }, // Hide on mobile if drawer has user details
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                      },
                    }}
                  >
                    <AccountCircle />
                  </IconButton>
                </Tooltip>
              )}

              {/* Logout Button (Desktop) */}
              {isAuthenticated && (
                <Button
                  variant="outlined"
                  startIcon={<LogoutIcon />}
                  onClick={onLogout}
                  sx={{
                    display: { xs: "none", md: "flex" }, // Hide on mobile, show in drawer
                    color: "white",
                    borderColor: "rgba(255, 255, 255, 0.5)",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": {
                      borderColor: "white",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  {t("logout")}
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Language Menu */}
      <Menu
        anchorEl={anchorElLang}
        open={Boolean(anchorElLang)}
        onClose={() => handleCloseLangMenu()}
        // This anchors the menu to the button that opened it
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleCloseLangMenu(lang.code)}
            selected={currentLang === lang.code}
          >
            {lang.label}
          </MenuItem>
        ))}
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better for performance on mobile
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
            borderRight: "none",
            boxShadow: theme.shadows[4],
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}