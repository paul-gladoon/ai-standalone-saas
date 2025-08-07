"use client";

import { useParams } from "next/navigation";
import { Navigation, FileText, Image as ImageIcon, Users, Palette, Settings, Edit, Save, Eye, ChevronRight } from "lucide-react";
import Image from "next/image";

// Mock data for sites - matching the dashboard data
const siteData = {
  1: {
    id: 1,
    name: "Human Resources",
    department: "HR",
    color: "#FF6B6B",
    description: "Employee policies, benefits, and HR resources",
    pages: 12,
    members: 8
  },
  2: {
    id: 2,
    name: "Finance Department",
    department: "Finance",
    color: "#4ECDC4",
    description: "Financial reports, budgets, and expense tracking",
    pages: 8,
    members: 5
  },
  3: {
    id: 3,
    name: "Information Technology",
    department: "IT",
    color: "#45B7D1",
    description: "Technical support, system documentation, and tools",
    pages: 15,
    members: 12
  },
  4: {
    id: 4,
    name: "Development Team",
    department: "Dev",
    color: "#3161D1",
    description: "Codebase, project management, and sprint planning",
    pages: 10,
    members: 6
  },
  5: {
    id: 5,
    name: "Marketing Team",
    department: "Marketing",
    color: "#7BC043",
    description: "Campaigns, brand guidelines, and content assets",
    pages: 7,
    members: 4
  }
};

// Mock horizontal navigation items
const horizontalNavItems = [
  { id: 1, label: "Home", href: "#", active: true },
  { id: 2, label: "Documents", href: "#", active: false },
  { id: 3, label: "Team", href: "#", active: false },
  { id: 4, label: "Resources", href: "#", active: false },
  { id: 5, label: "Contact", href: "#", active: false }
];

export default function SitePage() {
  const params = useParams();
  const siteId = Number(params.id);
  const site = siteData[siteId as keyof typeof siteData];

  // Redirect to 404 if site not found
  if (!site) {
    return <div>Site not found</div>;
  }

  return (
    <div className="flex h-screen bg-[#f5f6fa]">
      {/* Fixed Left Sidebar - 230px width */}
      <div className="w-[230px] bg-white border-r border-[#eaeaea] flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-[#eaeaea]">
          <Image
            src="/shortpoint-logo.svg"
            alt="ShortPoint"
            width={128}
            height={22}
            className="cursor-pointer"
          />
        </div>

        {/* Site Navigation Menu */}
        <nav className="flex-1 p-4">
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-[#5774A8] uppercase tracking-wide mb-2">
              {site.name}
            </h3>
          </div>
          <ul className="space-y-1">
            <li>
              <a
                href="#"
                className="flex items-center px-3 py-2 text-xs font-medium text-[#3161D1] bg-[#E7F5FF] rounded-none"
                style={{ lineHeight: '14px' }}
              >
                <Navigation className="w-4 h-4 mr-3" />
                Navigation
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-3 py-2 text-xs font-medium text-[#5774A8] hover:text-[#3161D1] hover:bg-[#E7F5FF] hover:bg-opacity-50 rounded-none transition-colors"
                style={{ lineHeight: '14px' }}
              >
                <FileText className="w-4 h-4 mr-3" />
                Pages
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-3 py-2 text-xs font-medium text-[#5774A8] hover:text-[#3161D1] hover:bg-[#E7F5FF] hover:bg-opacity-50 rounded-none transition-colors"
                style={{ lineHeight: '14px' }}
              >
                <ImageIcon className="w-4 h-4 mr-3" />
                Assets Library
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-3 py-2 text-xs font-medium text-[#5774A8] hover:text-[#3161D1] hover:bg-[#E7F5FF] hover:bg-opacity-50 rounded-none transition-colors"
                style={{ lineHeight: '14px' }}
              >
                <Users className="w-4 h-4 mr-3" />
                Site Team
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-3 py-2 text-xs font-medium text-[#5774A8] hover:text-[#3161D1] hover:bg-[#E7F5FF] hover:bg-opacity-50 rounded-none transition-colors"
                style={{ lineHeight: '14px' }}
              >
                <Palette className="w-4 h-4 mr-3" />
                Theme
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-3 py-2 text-xs font-medium text-[#5774A8] hover:text-[#3161D1] hover:bg-[#E7F5FF] hover:bg-opacity-50 rounded-none transition-colors"
                style={{ lineHeight: '14px' }}
              >
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </a>
            </li>
          </ul>
        </nav>

        {/* Back to Dashboard */}
        <div className="p-4 border-t border-[#eaeaea]">
          <a
            href="/"
            className="flex items-center px-3 py-2 text-xs font-medium text-[#5774A8] hover:text-[#3161D1] transition-colors"
            style={{ lineHeight: '14px' }}
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-[#eaeaea] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Breadcrumb Navigation */}
            <span className="text-sm text-[#5774A8]">Dashboard</span>
            <ChevronRight className="w-4 h-4 text-[#ADB5BD]" />
            <span className="text-sm font-medium text-[#202224]">{site.name}</span>
            <ChevronRight className="w-4 h-4 text-[#ADB5BD]" />
            <span className="text-sm text-[#5774A8]">Home</span>
          </div>

          <div className="flex items-center space-x-2">
            <button className="inline-flex items-center px-3 py-2 text-sm text-[#5774A8] border border-[#eaeaea] rounded-md hover:bg-[#f5f6fa] transition-colors">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </button>
            <button className="inline-flex items-center px-3 py-2 text-sm text-[#5774A8] border border-[#eaeaea] rounded-md hover:bg-[#f5f6fa] transition-colors">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </button>
            <button className="inline-flex items-center px-3 py-2 text-sm text-white bg-[#3161D1] rounded-md hover:bg-[#2a56c7] transition-colors">
              <Save className="w-4 h-4 mr-2" />
              Publish
            </button>
          </div>
        </header>

        {/* Horizontal Navigation Bar */}
        <nav
          className="bg-white border-b border-[#eaeaea] px-6 py-3"
          style={{ borderBottomColor: site.color }}
        >
          <ul className="flex space-x-6">
            {horizontalNavItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    item.active
                      ? 'text-[#202224] border-b-2 pb-2'
                      : 'text-[#5774A8] hover:text-[#202224]'
                  }`}
                  style={{
                    borderBottomColor: item.active ? site.color : 'transparent'
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content Section */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Welcome Section */}
          <div
            className="bg-white rounded-lg border border-[#eaeaea] p-8 mb-6"
            style={{
              background: `linear-gradient(135deg, ${site.color}15 0%, ${site.color}05 100%)`
            }}
          >
            <div className="flex items-start space-x-4">
              <div
                className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-semibold text-xl"
                style={{ backgroundColor: site.color }}
              >
                {site.department}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-[#202224] mb-2">
                  Welcome to {site.name}
                </h1>
                <p className="text-[#5774A8] mb-4">{site.description}</p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-[#5774A8]" />
                    <span className="text-sm text-[#5774A8]">{site.pages} Pages</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-[#5774A8]" />
                    <span className="text-sm text-[#5774A8]">{site.members} Members</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg border border-[#eaeaea] p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${site.color}20` }}
                >
                  <FileText className="w-5 h-5" style={{ color: site.color }} />
                </div>
                <h3 className="text-lg font-semibold text-[#202224]">Documents</h3>
              </div>
              <p className="text-sm text-[#5774A8] mb-4">Access important documents and files</p>
              <button
                className="text-sm font-medium transition-colors"
                style={{ color: site.color }}
              >
                View All Documents →
              </button>
            </div>

            <div className="bg-white rounded-lg border border-[#eaeaea] p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${site.color}20` }}
                >
                  <Users className="w-5 h-5" style={{ color: site.color }} />
                </div>
                <h3 className="text-lg font-semibold text-[#202224]">Team Directory</h3>
              </div>
              <p className="text-sm text-[#5774A8] mb-4">Connect with team members</p>
              <button
                className="text-sm font-medium transition-colors"
                style={{ color: site.color }}
              >
                View Team →
              </button>
            </div>

            <div className="bg-white rounded-lg border border-[#eaeaea] p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${site.color}20` }}
                >
                  <Settings className="w-5 h-5" style={{ color: site.color }} />
                </div>
                <h3 className="text-lg font-semibold text-[#202224]">Resources</h3>
              </div>
              <p className="text-sm text-[#5774A8] mb-4">Tools and resources for your work</p>
              <button
                className="text-sm font-medium transition-colors"
                style={{ color: site.color }}
              >
                Explore Resources →
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-[#eaeaea] p-6">
            <h3 className="text-lg font-semibold text-[#202224] mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-[#f5f6fa] rounded-md">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                  style={{ backgroundColor: site.color }}
                >
                  {site.department.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#202224]">New document added</p>
                  <p className="text-xs text-[#5774A8]">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-[#f5f6fa] rounded-md">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                  style={{ backgroundColor: site.color }}
                >
                  {site.department.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#202224]">Team member joined</p>
                  <p className="text-xs text-[#5774A8]">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}