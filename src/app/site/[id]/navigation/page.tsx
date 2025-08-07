"use client";

import { useParams } from "next/navigation";
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
  GripVertical,
  Edit,
  Trash2,
  Save,
  Eye,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import SiteThemePanel from "../../../../components/SiteThemePanel";

// Mock sites data
const mockSites = {
  hr: { name: "HR Department", theme: "#10B981", color: "emerald" },
  finance: { name: "Finance Department", theme: "#3B82F6", color: "blue" },
  it: { name: "IT Department", theme: "#8B5CF6", color: "purple" },
  dev: { name: "Development Team", theme: "#F59E0B", color: "amber" },
  marketing: { name: "Marketing Department", theme: "#EF4444", color: "red" },
};

// Mock navigation items
const initialNavItems: NavItem[] = [
  {
    id: "1",
    label: "Home",
    url: "/",
    type: "internal" as const,
    icon: "Home",
    children: [],
  },
  {
    id: "2",
    label: "Documents",
    url: "/documents",
    type: "internal" as const,
    icon: "FileText",
    children: [
      {
        id: "2-1",
        label: "Policies",
        url: "/documents/policies",
        type: "internal" as const,
        children: [],
      },
      {
        id: "2-2",
        label: "Procedures",
        url: "/documents/procedures",
        type: "internal" as const,
        children: [],
      },
      {
        id: "2-3",
        label: "Forms",
        url: "/documents/forms",
        type: "internal" as const,
        children: [],
      },
    ],
  },
  {
    id: "3",
    label: "Team",
    url: "/team",
    type: "internal" as const,
    icon: "Users",
    children: [],
  },
  {
    id: "4",
    label: "Resources",
    url: "/resources",
    type: "internal" as const,
    icon: "ExternalLink",
    children: [
      {
        id: "4-1",
        label: "Training Materials",
        url: "/resources/training",
        type: "internal" as const,
        children: [],
      },
      {
        id: "4-2",
        label: "External Tools",
        url: "https://example.com",
        type: "external" as const,
        children: [],
      },
    ],
  },
  {
    id: "5",
    label: "Contact",
    url: "/contact",
    type: "internal" as const,
    icon: "Home",
    children: [],
  },
];

interface NavItem {
  id: string;
  label: string;
  url: string;
  type: "internal" | "external";
  icon?: string;
  children: NavItem[];
}

export default function NavigationBuilder() {
  const params = useParams();
  const siteId = params.id as string;
  const site = mockSites[siteId as keyof typeof mockSites] || mockSites.hr;

  const [navItems, setNavItems] = useState<NavItem[]>(initialNavItems);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<NavItem | null>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>(["2", "4"]);

  // Form state for new/edit item
  const [formData, setFormData] = useState({
    label: "",
    url: "",
    type: "internal" as "internal" | "external",
    icon: "Home",
    parentId: "",
  });

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;

    const newNavItems = [...navItems];
    const draggedIndex = newNavItems.findIndex(
      (item) => item.id === draggedItem
    );
    const targetIndex = newNavItems.findIndex((item) => item.id === targetId);

    if (draggedIndex > -1 && targetIndex > -1) {
      const [draggedItemObj] = newNavItems.splice(draggedIndex, 1);
      newNavItems.splice(targetIndex, 0, draggedItemObj);
      setNavItems(newNavItems);
    }

    setDraggedItem(null);
  };

  const handleAddItem = () => {
    const newItem: NavItem = {
      id: Date.now().toString(),
      label: formData.label,
      url: formData.url,
      type: formData.type,
      icon: formData.icon,
      children: [],
    };

    if (formData.parentId) {
      // Add as child item
      const updatedItems = navItems.map((item) => {
        if (item.id === formData.parentId) {
          return { ...item, children: [...item.children, newItem] };
        }
        return item;
      });
      setNavItems(updatedItems);
    } else {
      // Add as top-level item
      setNavItems([...navItems, newItem]);
    }

    // Reset form
    setFormData({
      label: "",
      url: "",
      type: "internal",
      icon: "Home",
      parentId: "",
    });
    setShowAddModal(false);
  };

  const handleEditItem = (item: NavItem) => {
    setEditingItem(item);
    setFormData({
      label: item.label,
      url: item.url,
      type: item.type,
      icon: item.icon || "Home",
      parentId: "",
    });
    setShowAddModal(true);
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;

    const updateItemInArray = (items: NavItem[]): NavItem[] => {
      return items.map((item) => {
        if (item.id === editingItem.id) {
          return {
            ...item,
            label: formData.label,
            url: formData.url,
            type: formData.type,
            icon: formData.icon,
          };
        }
        if (item.children.length > 0) {
          return { ...item, children: updateItemInArray(item.children) };
        }
        return item;
      });
    };

    setNavItems(updateItemInArray(navItems));
    setEditingItem(null);
    setFormData({
      label: "",
      url: "",
      type: "internal",
      icon: "Home",
      parentId: "",
    });
    setShowAddModal(false);
  };

  const handleDeleteItem = (itemId: string) => {
    const deleteFromArray = (items: NavItem[]): NavItem[] => {
      return items.filter((item) => {
        if (item.id === itemId) return false;
        if (item.children.length > 0) {
          item.children = deleteFromArray(item.children);
        }
        return true;
      });
    };

    setNavItems(deleteFromArray(navItems));
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const hasChildren = item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);

    return (
      <div key={item.id} style={{ marginLeft: `${level * 20}px` }}>
        <div
          className={`flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md mb-2 ${
            draggedItem === item.id ? "opacity-50" : ""
          }`}
          draggable
          onDragStart={(e) => handleDragStart(e, item.id)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, item.id)}
        >
          <div className="flex items-center space-x-3">
            <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
            {hasChildren && (
              <button
                onClick={() => toggleExpanded(item.id)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">
                {item.label}
              </span>
              <span className="text-xs text-gray-500">({item.url})</span>
              {item.type === "external" && (
                <ExternalLink className="w-3 h-3 text-blue-500" />
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleEditItem(item)}
              className="p-1 text-blue-600 hover:text-blue-900"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteItem(item.id)}
              className="p-1 text-red-600 hover:text-red-900"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-4">
            {item.children.map((child) => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderPreviewNav = () => (
    <div
      className="bg-white border border-gray-200 rounded-lg p-4"
      style={{ borderTop: `4px solid ${site.theme}` }}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Navigation Preview
      </h3>
      <nav className="space-y-1">
        {navItems.map((item) => (
          <div key={item.id}>
            <a
              href={item.url}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
              style={{
                color: expandedItems.includes(item.id) ? site.theme : undefined,
              }}
            >
              <span>{item.label}</span>
              {item.children.length > 0 && (
                <ChevronDown className="ml-auto w-4 h-4" />
              )}
            </a>
            {item.children.length > 0 && expandedItems.includes(item.id) && (
              <div className="ml-4 space-y-1">
                {item.children.map((child) => (
                  <a
                    key={child.id}
                    href={child.url}
                    className="flex items-center px-3 py-2 text-sm text-gray-600 rounded-md hover:bg-gray-50"
                  >
                    {child.label}
                    {child.type === "external" && (
                      <ExternalLink className="ml-1 w-3 h-3" />
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );

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
            <div className="flex items-center px-3 py-2 text-sm font-medium bg-[#E7F5FF] text-[#3161D1] rounded-md">
              <Navigation className="mr-3 h-4 w-4" />
              Navigation
            </div>

            <Link
              href={`/site/${siteId}/pages`}
              className="flex items-center px-3 py-2 text-sm font-medium text-[#5774A8] hover:bg-[#E7F5FF] hover:text-[#3161D1] rounded-md"
            >
              <FileText className="mr-3 h-4 w-4" />
              Pages
            </Link>

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
              href={`/site/${siteId}`}
              className="flex items-center px-3 py-2 text-sm font-medium text-[#5774A8] hover:bg-[#E7F5FF] hover:text-[#3161D1] rounded-md"
            >
              <ArrowLeft className="mr-3 h-4 w-4" />
              Back to Site
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
              <Link href="/" className="hover:text-[#3161D1]">
                Dashboard
              </Link>
              <span>›</span>
              <Link href={`/site/${siteId}`} className="hover:text-[#3161D1]">
                {site.name}
              </Link>
              <span>›</span>
              <span className="font-medium text-gray-900">
                Navigation Builder
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Eye className="w-4 h-4 mr-2 inline" />
                {isPreview ? "Edit" : "Preview"}
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                <Save className="w-4 h-4 mr-2 inline" />
                Save Changes
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {isPreview ? (
              renderPreviewNav()
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Navigation Builder */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Navigation Structure
                      </h2>
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 py-2 text-sm font-medium text-white rounded-md"
                        style={{ backgroundColor: site.theme }}
                      >
                        <Plus className="w-4 h-4 mr-2 inline" />
                        Add Item
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Drag and drop to reorder menu items
                    </p>
                  </div>

                  <div className="p-6">
                    {navItems.length === 0 ? (
                      <div className="text-center py-8">
                        <Navigation className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No navigation items
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Get started by adding your first menu item.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {navItems.map((item) => renderNavItem(item))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Live Preview */}
                <div className="space-y-6">
                  {renderPreviewNav()}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">
                      Navigation Tips
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Drag items to reorder them</li>
                      <li>• Use external links for third-party tools</li>
                      <li>• Group related items under parent menus</li>
                      <li>• Keep menu labels short and descriptive</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingItem ? "Edit Menu Item" : "Add Menu Item"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) =>
                      setFormData({ ...formData, label: e.target.value })
                    }
                    placeholder="Menu item label"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL
                  </label>
                  <input
                    type="text"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    placeholder="/page-url or https://external-site.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as "internal" | "external",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="internal">Internal Link</option>
                    <option value="external">External Link</option>
                  </select>
                </div>
                {!editingItem && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parent Menu (Optional)
                    </label>
                    <select
                      value={formData.parentId}
                      onChange={(e) =>
                        setFormData({ ...formData, parentId: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Top Level</option>
                      {navItems.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingItem(null);
                    setFormData({
                      label: "",
                      url: "",
                      type: "internal",
                      icon: "Home",
                      parentId: "",
                    });
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={editingItem ? handleUpdateItem : handleAddItem}
                  className="px-4 py-2 text-sm font-medium text-white rounded-md"
                  style={{ backgroundColor: site.theme }}
                >
                  {editingItem ? "Update" : "Add"} Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Site Theme Panel */}
      <SiteThemePanel siteId={siteId} siteTheme={site.theme} />
    </div>
  );
}
