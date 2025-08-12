"use client";

import {
  Building2,
  Settings,
  FileText,
  HelpCircle,
  Plus,
  Search,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  getSavedThemeColor,
  getSavedTheme,
} from "../components/SiteThemePanel";
import { useEffect, useState, useLayoutEffect } from "react";
import AuthGuard from "../components/AuthGuard";
import { useAuth } from "../components/providers/AuthProvider";

// Mock data for site collections
const mockSites = [
  {
    id: 1,
    name: "Human Resources",
    department: "HR",
    status: "active",
    recentActivity: "2 hours ago",
    color: "#F8A5A5", // Soft coral pink
    pages: 12,
    members: 8,
    description: "Employee policies, benefits, and HR resources",
  },
  {
    id: 2,
    name: "Finance Department",
    department: "Finance",
    status: "active",
    recentActivity: "1 day ago",
    color: "#7DD3C0", // Soft mint green
    pages: 8,
    members: 5,
    description: "Financial reports, budgets, and expense tracking",
  },
  {
    id: 3,
    name: "Information Technology",
    department: "IT",
    status: "active",
    recentActivity: "3 hours ago",
    color: "#92C5F7", // Soft sky blue
    pages: 15,
    members: 12,
    description: "Technical support, system documentation, and tools",
  },
  {
    id: 4,
    name: "Development Team",
    department: "Dev",
    status: "active",
    recentActivity: "30 minutes ago",
    color: "#8B9FE6", // Soft lavender blue
    pages: 10,
    members: 6,
    description: "Codebase, project management, and sprint planning",
  },
  {
    id: 5,
    name: "Marketing Team",
    department: "Marketing",
    status: "active",
    recentActivity: "5 hours ago",
    color: "#B8E6B8", // Soft sage green
    pages: 7,
    members: 4,
    description: "Campaigns, brand guidelines, and content assets",
  },
];

interface SiteTheme {
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    surface: string;
    background: string;
    text: string;
    textSecondary: string;
  };
  text: {
    fontFamily: string;
    fontSize: string;
  };
  buttons: {
    borderRadius: string;
    padding: string;
  };
}

function TenantDashboard() {
  const [siteColors, setSiteColors] = useState<Record<number, string>>({});
  const [siteThemes, setSiteThemes] = useState<Record<number, SiteTheme>>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  // Load saved theme colors and complete themes BEFORE painting to prevent flash
  useLayoutEffect(() => {
    const colors: Record<number, string> = {};
    const themes: Record<number, SiteTheme> = {};
    mockSites.forEach((site) => {
      colors[site.id] = getSavedThemeColor(site.id.toString(), site.color);
      themes[site.id] = getSavedTheme(site.id.toString(), site.color);
    });
    setSiteColors(colors);
    setSiteThemes(themes);
  }, []);

  // Listen for theme updates
  useEffect(() => {
    const handleThemeUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      const siteId = parseInt(customEvent.detail?.siteId);
      if (siteId && customEvent.detail?.theme) {
        setSiteColors((prev) => ({
          ...prev,
          [siteId]: customEvent.detail.theme.colorPalette.primary,
        }));
        setSiteThemes((prev) => ({
          ...prev,
          [siteId]: customEvent.detail.theme,
        }));
      }
    };

    window.addEventListener("themeUpdated", handleThemeUpdate);

    return () => {
      window.removeEventListener("themeUpdated", handleThemeUpdate);
    };
  }, []);

  return (
    <div className="flex h-screen bg-[#f5f6fa] relative">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop and Mobile */}
      <div
        className={`
          fixed lg:relative z-50 lg:z-auto
          w-[280px] lg:w-[230px] h-full
          bg-white border-r border-[#eaeaea] flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Logo Section */}
        <div className="p-4 lg:p-6 border-b border-[#eaeaea] flex items-center justify-between">
          <Image
            src="/shortpoint-logo.svg"
            alt="ShortPoint"
            width={128}
            height={22}
            className="cursor-pointer"
          />
          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-2 text-[#5774A8] hover:text-[#3161D1] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            <li>
              <a
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-3 py-3 lg:py-2 text-sm lg:text-xs font-medium text-[#3161D1] bg-[#E7F5FF] rounded-none transition-all duration-200"
                style={{ lineHeight: "16px" }}
              >
                <Building2 className="w-5 h-5 lg:w-4 lg:h-4 mr-3" />
                Sites
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-3 py-3 lg:py-2 text-sm lg:text-xs font-medium text-[#5774A8] hover:text-[#3161D1] hover:bg-[#E7F5FF] hover:bg-opacity-50 rounded-none transition-all duration-200"
                style={{ lineHeight: "16px" }}
              >
                <FileText className="w-5 h-5 lg:w-4 lg:h-4 mr-3" />
                Licensing
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-3 py-3 lg:py-2 text-sm lg:text-xs font-medium text-[#5774A8] hover:text-[#3161D1] hover:bg-[#E7F5FF] hover:bg-opacity-50 rounded-none transition-all duration-200"
                style={{ lineHeight: "16px" }}
              >
                <Settings className="w-5 h-5 lg:w-4 lg:h-4 mr-3" />
                Tenant Settings
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-3 py-3 lg:py-2 text-sm lg:text-xs font-medium text-[#5774A8] hover:text-[#3161D1] hover:bg-[#E7F5FF] hover:bg-opacity-50 rounded-none transition-all duration-200"
                style={{ lineHeight: "16px" }}
              >
                <HelpCircle className="w-5 h-5 lg:w-4 lg:h-4 mr-3" />
                Support
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
        <header className="bg-white border-b border-[#eaeaea] px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between">
          <div className="flex items-center">
            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 mr-2 text-[#5774A8] hover:text-[#3161D1] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg lg:text-xl font-semibold text-[#202224]">
              My Sites
            </h1>
          </div>

          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Search - Hidden on mobile, shown on tablet+ */}
            <div className="hidden sm:block relative">
              <input
                type="text"
                placeholder="Search sites..."
                className="pl-10 pr-4 py-2 border border-[#eaeaea] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3161D1] focus:border-transparent text-sm w-48 lg:w-auto"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#ADB5BD]" />
            </div>

            {/* Mobile Search Button */}
            <button className="sm:hidden p-2 text-[#5774A8] hover:text-[#3161D1] transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 lg:w-9 lg:h-9 bg-[#3161D1] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
              <span className="hidden sm:block text-sm font-medium text-[#202224] truncate max-w-[100px] lg:max-w-none">
                {user?.name || "User"}
              </span>
              <button
                onClick={logout}
                className="p-1 lg:p-2 text-[#5774A8] hover:text-[#3161D1] transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {/* Create New Site Button */}
          <div className="mb-6">
            <button className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 lg:px-4 lg:py-2 bg-[#3161D1] text-white text-sm font-medium rounded-md hover:bg-[#2a56c7] focus:outline-none focus:ring-2 focus:ring-[#3161D1] focus:ring-offset-2 transition-all duration-200 touch-manipulation">
              <Plus className="w-5 h-5 lg:w-4 lg:h-4 mr-2" />
              Create New Site
            </button>
          </div>

          {/* Site Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {mockSites.map((site) => {
              const currentColor = siteColors[site.id] || site.color;
              const currentTheme = siteThemes[site.id];
              return (
                <Link
                  key={site.id}
                  href={`/site/${site.id}`}
                  className="block w-full touch-manipulation"
                >
                  <div
                    className="rounded-lg border border-[#eaeaea] p-4 lg:p-6 hover:shadow-lg active:shadow-md hover:border-[#3161D1] hover:border-opacity-30 transition-all duration-200 cursor-pointer group h-full flex flex-col"
                    style={{
                      backgroundColor:
                        currentTheme?.colorPalette?.surface || "#ffffff",
                      fontFamily: currentTheme?.text?.fontFamily || "Inter",
                    }}
                  >
                    {/* Site Image */}
                    <div className="mb-4 flex-shrink-0">
                      <div
                        className="w-full h-24 sm:h-28 lg:h-32 rounded-lg flex items-center justify-center text-white font-semibold text-base sm:text-lg transition-transform group-hover:scale-[1.02] group-active:scale-[0.98]"
                        style={{
                          backgroundColor: currentColor,
                          fontSize: currentTheme?.text?.fontSize || "18px",
                          fontFamily: currentTheme?.text?.fontFamily || "Inter",
                        }}
                      >
                        {site.department}
                      </div>
                    </div>

                    {/* Site Details */}
                    <div className="flex-1 flex flex-col">
                      {/* Site Name */}
                      <h3
                        className="text-base lg:text-lg font-semibold mb-2 line-clamp-2 group-hover:text-[#3161D1] transition-colors"
                        style={{
                          color: currentTheme?.colorPalette?.text || "#202224",
                          fontFamily: currentTheme?.text?.fontFamily || "Inter",
                        }}
                      >
                        {site.name}
                      </h3>

                      {/* Site URL */}
                      <p
                        className="text-sm mb-3 truncate"
                        style={{
                          color:
                            currentTheme?.colorPalette?.textSecondary ||
                            "#5774A8",
                          fontFamily: currentTheme?.text?.fontFamily || "Inter",
                        }}
                      >
                        {site.department.toLowerCase()}.company.com
                      </p>

                      {/* Site Stats - Mobile Optimized */}
                      <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between text-xs text-[#5774A8]">
                        <span className="flex items-center">
                          <FileText className="w-3 h-3 mr-1" />
                          {site.pages} pages
                        </span>
                        <span className="flex items-center">
                          <Building2 className="w-3 h-3 mr-1" />
                          {site.members} members
                        </span>
                      </div>

                      {/* Recent Activity */}
                      <p className="text-xs text-[#ADB5BD] mt-2">
                        Updated {site.recentActivity}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
export default function Home() {
  return (
    <AuthGuard>
      <TenantDashboard />
    </AuthGuard>
  );
}
