import { useState, useEffect } from "react";
import {
  Home,
  BarChart3,
  FileText,
  Settings,
  X,
  Menu,
  ChevronsLeft,
  ChevronsRight,
  Languages,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "../../hooks/useTranslations";

// Define navigation using translation keys
const navigation = [
  { nameKey: "sidebar.dashboard", href: "/", icon: Home },
  { nameKey: "sidebar.reports", href: "/reports", icon: BarChart3 },
  { nameKey: "sidebar.documents", href: "/documents", icon: FileText },
  { nameKey: "sidebar.settings", href: "/settings", icon: Settings },
];

interface SidebarLayoutProps {
  isAuthenticated: boolean;
  onLogout: () => void;
  children?: React.ReactNode;
}

export default function SidebarLayout({
  isAuthenticated,
  onLogout,
  children,
}: SidebarLayoutProps) {
  const { t, lang, changeLanguage } = useTranslation();

  // Sidebar states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });

  // Save sidebar state
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  // Toggle between English and Arabic
  const toggleLanguage = () => {
    changeLanguage(lang === "en" ? "ar" : "en");
  };

  // Get direction for layout
  const direction = lang === "ar" ? "rtl" : "ltr";

  return (
    <div dir={direction} className="h-screen flex bg-gray-100 overflow-hidden">
      {/* Mobile Sidebar (Off-canvas) — only on mobile */}
      <div
        className={`fixed inset-0 z-40 flex lg:hidden transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        ></div>

        {/* Sidebar Panel */}
        <div className="relative flex-1 flex flex-col w-64 bg-white max-w-xs">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
              aria-label={t("common.closeSidebar") || "Close sidebar"}
            >
              <X className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          <SidebarContent
            collapsed={false}
            onItemClick={() => setSidebarOpen(false)}
            t={t}
          />
        </div>
      </div>

      {/* Desktop Sidebar — collapsible */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div
          className={`flex flex-col bg-white shadow-xl transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? "w-16" : "w-64"
          }`}
        >
          <div className="flex justify-end pt-4 pr-2">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label={
                sidebarCollapsed
                  ? t("common.expandSidebar") || "Expand sidebar"
                  : t("common.collapseSidebar") || "Collapse sidebar"
              }
            >
              {sidebarCollapsed ? (
                <ChevronsRight className="h-5 w-5" />
              ) : (
                <ChevronsLeft className="h-5 w-5" />
              )}
            </button>
          </div>
          <SidebarContent collapsed={sidebarCollapsed} t={t} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navbar */}
        <div className="flex items-center justify-between h-16 bg-white px-4 shadow-sm lg:px-6">
          <div className="flex items-center">
            {/* Burger for mobile */}
            <button
              type="button"
              className="p-2 rounded-md text-gray-500 lg:hidden focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => setSidebarOpen(true)}
              aria-label={t("common.openSidebar") || "Open sidebar"}
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Brand name — dynamically translated */}
            <h1 className="ml-4 text-xl font-semibold text-gray-900 lg:inline-block">
              {t("brand")}
            </h1>
          </div>

          {isAuthenticated && (
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <span className="text-sm text-gray-500">{t("common.welcome")}</span>

              {/* Language Toggle Button */}
              <button
                onClick={toggleLanguage}
                className="p-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center space-x-1 rtl:space-x-reverse"
                aria-label={
                  lang === "ar"
                    ? t("common.switchToEnglish")
                    : t("common.switchToArabic")
                }
              >
                <Languages className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {lang === "ar" ? "EN" : "AR"}
                </span>
              </button>

              <button
                onClick={onLogout}
                className="px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                {t("common.logout")}
              </button>
            </div>
          )}
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

// Reusable Sidebar Content
interface SidebarContentProps {
  collapsed: boolean;
  onItemClick?: () => void;
  t: (key: string) => string;
}

function SidebarContent({ collapsed, onItemClick, t }: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full pt-2 pb-4">
      {/* Logo Section */}
      <div className="px-4 flex items-center justify-center lg:justify-start">
        <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">L</span>
        </div>
        {!collapsed && (
          <h1 className="ml-3 text-xl font-bold text-gray-900">{t("brand")}</h1>
        )}
      </div>

      {/* Navigation Links */}
      <div className="mt-6 flex-1 flex flex-col">
        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.nameKey}
                to={item.href}
                activeProps={{
                  className: "bg-gray-100 text-gray-900",
                }}
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors ${
                  collapsed ? "justify-center" : ""
                }`}
                onClick={() => {
                  if (onItemClick) {
                    onItemClick();
                  }
                }}
              >
                <Icon
                  className={`h-6 w-6 flex-shrink-0 ${
                    collapsed ? "" : "mr-4"
                  } text-gray-500 group-hover:text-gray-700`}
                  aria-hidden="true"
                />
                {!collapsed && <span>{t(item.nameKey)}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="px-4 mt-auto pt-4 border-t border-gray-200">
        <a
          href="#"
          className="flex items-center text-gray-500 hover:text-gray-700"
        >
          <Settings className="h-6 w-6 mr-3" />
          <span>{t("accountSettings")}</span>
        </a>
      </div>
    </div>
  );
}