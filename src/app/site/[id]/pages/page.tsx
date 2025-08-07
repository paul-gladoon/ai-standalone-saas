"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  Navigation,
  FileText,
  Image as ImageIcon,
  Users,
  Palette,
  Settings,
  ArrowLeft,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Eye,
  Filter,
  SortAsc,
  SortDesc,
  Calendar
} from "lucide-react";

// Mock data for pages
const mockPages = [
  {
    id: "page-1",
    title: "Welcome to HR Department",
    slug: "welcome",
    status: "Published",
    createdDate: "2024-01-15",
    modifiedDate: "2024-01-20",
    author: "John Doe"
  },
  {
    id: "page-2",
    title: "Employee Handbook",
    slug: "employee-handbook",
    status: "Published",
    createdDate: "2024-01-10",
    modifiedDate: "2024-01-18",
    author: "Jane Smith"
  },
  {
    id: "page-3",
    title: "Benefits Overview",
    slug: "benefits",
    status: "Draft",
    createdDate: "2024-01-22",
    modifiedDate: "2024-01-22",
    author: "Mike Johnson"
  },
  {
    id: "page-4",
    title: "Policies and Procedures",
    slug: "policies",
    status: "Published",
    createdDate: "2024-01-05",
    modifiedDate: "2024-01-15",
    author: "Sarah Wilson"
  },
  {
    id: "page-5",
    title: "Training Materials",
    slug: "training",
    status: "Archived",
    createdDate: "2023-12-20",
    modifiedDate: "2024-01-10",
    author: "Tom Brown"
  }
];

// Mock sites data
const mockSites = {
  "hr": { name: "HR Department", theme: "#10B981", color: "emerald" },
  "finance": { name: "Finance Department", theme: "#3B82F6", color: "blue" },
  "it": { name: "IT Department", theme: "#8B5CF6", color: "purple" },
  "dev": { name: "Development Team", theme: "#F59E0B", color: "amber" },
  "marketing": { name: "Marketing Department", theme: "#EF4444", color: "red" }
};

export default function SitePages() {
  const params = useParams();
  const router = useRouter();
  const siteId = params.id as string;
  const site = mockSites[siteId as keyof typeof mockSites] || mockSites.hr;

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortField, setSortField] = useState<string>("modifiedDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  // Filter and sort pages
  const filteredPages = mockPages
    .filter(page => {
      const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           page.slug.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || page.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortField as keyof typeof a];
      let bValue = b[sortField as keyof typeof b];

      if (sortField === "createdDate" || sortField === "modifiedDate") {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectPage = (pageId: string) => {
    setSelectedPages(prev =>
      prev.includes(pageId)
        ? prev.filter(id => id !== pageId)
        : [...prev, pageId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPages.length === filteredPages.length) {
      setSelectedPages([]);
    } else {
      setSelectedPages(filteredPages.map(page => page.id));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      Published: "bg-green-100 text-green-800 border-green-200",
      Draft: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Archived: "bg-gray-100 text-gray-800 border-gray-200"
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded border ${statusStyles[status as keyof typeof statusStyles]}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-[230px] bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <Link href="/">
            <img src="/shortpoint-logo.svg" alt="ShortPoint" className="h-8" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            <Link
              href={`/site/${siteId}`}
              className="flex items-center px-3 py-2 text-sm font-medium text-[#5774A8] hover:bg-[#E7F5FF] hover:text-[#3161D1] rounded-md"
            >
              <Navigation className="mr-3 h-4 w-4" />
              Navigation
            </Link>

            <div className="flex items-center px-3 py-2 text-sm font-medium bg-[#E7F5FF] text-[#3161D1] rounded-md">
              <FileText className="mr-3 h-4 w-4" />
              Pages
            </div>

            <Link
              href={`/site/${siteId}/assets`}
              className="flex items-center px-3 py-2 text-sm font-medium text-[#5774A8] hover:bg-[#E7F5FF] hover:text-[#3161D1] rounded-md"
            >
              <ImageIcon className="mr-3 h-4 w-4" />
              Assets Library
            </Link>

            <Link
              href={`/site/${siteId}/team`}
              className="flex items-center px-3 py-2 text-sm font-medium text-[#5774A8] hover:bg-[#E7F5FF] hover:text-[#3161D1] rounded-md"
            >
              <Users className="mr-3 h-4 w-4" />
              Site Team
            </Link>

            <Link
              href={`/site/${siteId}/theme`}
              className="flex items-center px-3 py-2 text-sm font-medium text-[#5774A8] hover:bg-[#E7F5FF] hover:text-[#3161D1] rounded-md"
            >
              <Palette className="mr-3 h-4 w-4" />
              Theme
            </Link>

            <Link
              href={`/site/${siteId}/settings`}
              className="flex items-center px-3 py-2 text-sm font-medium text-[#5774A8] hover:bg-[#E7F5FF] hover:text-[#3161D1] rounded-md"
            >
              <Settings className="mr-3 h-4 w-4" />
              Settings
            </Link>
          </div>

          <div className="mt-8">
            <Link
              href="/"
              className="flex items-center px-3 py-2 text-sm font-medium text-[#5774A8] hover:bg-[#E7F5FF] hover:text-[#3161D1] rounded-md"
            >
              <ArrowLeft className="mr-3 h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-[#3161D1]">Dashboard</Link>
              <span>›</span>
              <Link href={`/site/${siteId}`} className="hover:text-[#3161D1]">{site.name}</Link>
              <span>›</span>
              <span className="font-medium text-gray-900">Pages</span>
            </div>

            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                <Eye className="w-4 h-4 mr-2 inline" />
                Preview Site
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 text-sm font-medium text-white rounded-md"
                style={{ backgroundColor: site.theme }}
              >
                <Plus className="w-4 h-4 mr-2 inline" />
                Create Page
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Site Pages</h2>

                <div className="flex items-center space-x-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search pages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="All">All Status</option>
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>

                  <button className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedPages.length > 0 && (
                <div className="mt-4 flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    {selectedPages.length} page(s) selected
                  </span>
                  <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800">
                    Publish
                  </button>
                  <button className="px-3 py-1 text-sm text-yellow-600 hover:text-yellow-800">
                    Archive
                  </button>
                  <button className="px-3 py-1 text-sm text-red-600 hover:text-red-800">
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedPages.length === filteredPages.length}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("title")}
                    >
                      <div className="flex items-center">
                        Page Name
                        {sortField === "title" && (
                          sortDirection === "asc" ? <SortAsc className="ml-1 w-4 h-4" /> : <SortDesc className="ml-1 w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center">
                        Status
                        {sortField === "status" && (
                          sortDirection === "asc" ? <SortAsc className="ml-1 w-4 h-4" /> : <SortDesc className="ml-1 w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("createdDate")}
                    >
                      <div className="flex items-center">
                        Created Date
                        {sortField === "createdDate" && (
                          sortDirection === "asc" ? <SortAsc className="ml-1 w-4 h-4" /> : <SortDesc className="ml-1 w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("modifiedDate")}
                    >
                      <div className="flex items-center">
                        Modified Date
                        {sortField === "modifiedDate" && (
                          sortDirection === "asc" ? <SortAsc className="ml-1 w-4 h-4" /> : <SortDesc className="ml-1 w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPages.map((page) => (
                    <tr key={page.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedPages.includes(page.id)}
                          onChange={() => handleSelectPage(page.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{page.title}</div>
                            <div className="text-sm text-gray-500">/{page.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(page.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          {formatDate(page.createdDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          {formatDate(page.modifiedDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {page.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => router.push(`/site/${siteId}/pages/${page.id}/edit`)}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => setShowDeleteModal(page.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredPages.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No pages found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || statusFilter !== "All"
                    ? "Try adjusting your search or filter criteria."
                    : "Get started by creating your first page."
                  }
                </p>
                {(!searchTerm && statusFilter === "All") && (
                  <div className="mt-6">
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white"
                      style={{ backgroundColor: site.theme }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Page
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Pagination */}
            {filteredPages.length > 0 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredPages.length}</span> of{' '}
                      <span className="font-medium">{filteredPages.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        Previous
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                        1
                      </button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Page Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Page</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter page title..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page Slug
                  </label>
                  <input
                    type="text"
                    placeholder="page-url-slug"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-white rounded-md"
                  style={{ backgroundColor: site.theme }}
                >
                  Create Page
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Page</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete this page? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}