"use client";

import { Building2, Settings, FileText, HelpCircle, Plus, Search, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Mock data for site collections
const mockSites = [
  {
    id: 1,
    name: "Human Resources",
    department: "HR",
    status: "active",
    recentActivity: "2 hours ago",
    color: "#FF6B6B",
    pages: 12,
    members: 8,
    description: "Employee policies, benefits, and HR resources"
  },
  {
    id: 2,
    name: "Finance Department",
    department: "Finance",
    status: "active",
    recentActivity: "1 day ago",
    color: "#4ECDC4",
    pages: 8,
    members: 5,
    description: "Financial reports, budgets, and expense tracking"
  },
  {
    id: 3,
    name: "Information Technology",
    department: "IT",
    status: "active",
    recentActivity: "3 hours ago",
    color: "#45B7D1",
    pages: 15,
    members: 12,
    description: "Technical support, system documentation, and tools"
  },
  {
    id: 4,
    name: "Development Team",
    department: "Dev",
    status: "active",
    recentActivity: "30 minutes ago",
    color: "#3161D1",
    pages: 10,
    members: 6,
    description: "Codebase, project management, and sprint planning"
  },
  {
    id: 5,
    name: "Marketing Team",
    department: "Marketing",
    status: "active",
    recentActivity: "5 hours ago",
    color: "#7BC043",
    pages: 7,
    members: 4,
    description: "Campaigns, brand guidelines, and content assets"
  }
];

export default function TenantDashboard() {
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

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            <li>
              <a
                href="#"
                className="flex items-center px-3 py-2 text-xs font-medium text-[#3161D1] bg-[#E7F5FF] rounded-none"
                style={{ lineHeight: '14px' }}
              >
                <Building2 className="w-4 h-4 mr-3" />
                Sites
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-3 py-2 text-xs font-medium text-[#5774A8] hover:text-[#3161D1] hover:bg-[#E7F5FF] hover:bg-opacity-50 rounded-none transition-colors"
                style={{ lineHeight: '14px' }}
              >
                <FileText className="w-4 h-4 mr-3" />
                Licensing
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-3 py-2 text-xs font-medium text-[#5774A8] hover:text-[#3161D1] hover:bg-[#E7F5FF] hover:bg-opacity-50 rounded-none transition-colors"
                style={{ lineHeight: '14px' }}
              >
                <Settings className="w-4 h-4 mr-3" />
                Tenant Settings
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center px-3 py-2 text-xs font-medium text-[#5774A8] hover:text-[#3161D1] hover:bg-[#E7F5FF] hover:bg-opacity-50 rounded-none transition-colors"
                style={{ lineHeight: '14px' }}
              >
                <HelpCircle className="w-4 h-4 mr-3" />
                Support
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
                {/* Header Bar */}
        <header className="bg-white border-b border-[#eaeaea] px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-[#202224]">My Sites</h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search sites..."
                className="pl-10 pr-4 py-2 border border-[#eaeaea] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3161D1] focus:border-transparent text-sm"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#ADB5BD]" />
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#3161D1] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              <span className="text-sm font-medium text-[#202224]">Admin User</span>
              <ChevronDown className="w-4 h-4 text-[#5774A8]" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Create New Site Button */}
          <div className="mb-6">
            <button className="inline-flex items-center px-4 py-2 bg-[#3161D1] text-white text-sm font-medium rounded-md hover:bg-[#2a56c7] focus:outline-none focus:ring-2 focus:ring-[#3161D1] focus:ring-offset-2 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Create New Site
            </button>
          </div>

          {/* Site Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSites.map((site) => (
              <Link key={site.id} href={`/site/${site.id}`}>
                <div className="bg-white rounded-lg border border-[#eaeaea] p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group">
                  {/* Site Image */}
                  <div className="mb-4">
                    <div
                      className="w-full h-32 rounded-lg flex items-center justify-center text-white font-semibold text-lg"
                      style={{ backgroundColor: site.color }}
                    >
                      {site.department}
                    </div>
                  </div>

                  {/* Site Name */}
                  <h3 className="text-lg font-semibold text-[#202224] mb-2">{site.name}</h3>

                  {/* Site URL */}
                  <p className="text-sm text-[#5774A8] mb-4">{site.department.toLowerCase()}.company.com</p>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
