"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Navigation,
  FileText,
  Image as ImageIcon,
  Users,
  Palette,
  Settings,
  ArrowLeft,
  Save,
  Eye,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
} from "lucide-react";
import AuthGuard from "../../../../../../components/AuthGuard";

// Mock page data
const mockPage = {
  id: "page-1",
  title: "Welcome to HR Department",
  slug: "welcome",
  status: "Published",
  content: `<h1>Welcome to the HR Department</h1>
<p>Welcome to our HR Department portal. Here you'll find all the resources and information you need for your employment journey with us.</p>

<h2>What You'll Find Here</h2>
<ul>
<li>Employee handbook and policies</li>
<li>Benefits information</li>
<li>Training materials</li>
<li>Contact information</li>
</ul>

<h2>Getting Started</h2>
<p>If you're new to the company, please make sure to:</p>
<ol>
<li>Review the employee handbook</li>
<li>Complete your benefits enrollment</li>
<li>Schedule your orientation session</li>
</ol>

<p>For any questions, please don't hesitate to reach out to our HR team.</p>`,
  createdDate: "2024-01-15",
  modifiedDate: "2024-01-20",
  author: "John Doe",
};

// Mock sites data
const mockSites = {
  hr: { name: "HR Department", theme: "#10B981", color: "emerald" },
  finance: { name: "Finance Department", theme: "#3B82F6", color: "blue" },
  it: { name: "IT Department", theme: "#8B5CF6", color: "purple" },
  dev: { name: "Development Team", theme: "#F59E0B", color: "amber" },
  marketing: { name: "Marketing Department", theme: "#EF4444", color: "red" },
};

function PageEditor() {
  const params = useParams();
  const siteId = params.id as string;
  // const pageId = params.pageId as string; // Will be used to fetch specific page data
  const site = mockSites[siteId as keyof typeof mockSites] || mockSites.hr;
  const page = mockPage; // In real app, fetch by pageId

  const [title, setTitle] = useState(page.title);
  const [slug, setSlug] = useState(page.slug);
  const [content, setContent] = useState(page.content);
  const [status, setStatus] = useState(page.status);
  const [isDirty, setIsDirty] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving page:", { title, slug, content, status });
    setIsDirty(false);
  };

  const handlePublish = () => {
    setStatus("Published");
    handleSave();
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setIsDirty(true);
  };

  const insertFormatting = (tag: string) => {
    const textarea = document.getElementById(
      "content-editor"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let newContent = "";

    switch (tag) {
      case "bold":
        newContent =
          content.substring(0, start) +
          `<strong>${selectedText}</strong>` +
          content.substring(end);
        break;
      case "italic":
        newContent =
          content.substring(0, start) +
          `<em>${selectedText}</em>` +
          content.substring(end);
        break;
      case "h1":
        newContent =
          content.substring(0, start) +
          `<h1>${selectedText || "Heading 1"}</h1>` +
          content.substring(end);
        break;
      case "h2":
        newContent =
          content.substring(0, start) +
          `<h2>${selectedText || "Heading 2"}</h2>` +
          content.substring(end);
        break;
      case "ul":
        newContent =
          content.substring(0, start) +
          `<ul>\n<li>${selectedText || "List item"}</li>\n</ul>` +
          content.substring(end);
        break;
      case "ol":
        newContent =
          content.substring(0, start) +
          `<ol>\n<li>${selectedText || "List item"}</li>\n</ol>` +
          content.substring(end);
        break;
      case "link":
        newContent =
          content.substring(0, start) +
          `<a href="https://example.com">${selectedText || "Link text"}</a>` +
          content.substring(end);
        break;
      case "p":
        newContent =
          content.substring(0, start) +
          `<p>${selectedText || "Paragraph text"}</p>` +
          content.substring(end);
        break;
      default:
        return;
    }

    handleContentChange(newContent);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-[230px] bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <Link href="/">
            <Image src="/shortpoint-logo.svg" alt="ShortPoint" width={128} height={32} className="h-8" />
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

            <Link
              href={`/site/${siteId}/pages`}
              className="flex items-center px-3 py-2 text-sm font-medium bg-[#E7F5FF] text-[#3161D1] rounded-md"
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
              href={`/site/${siteId}/pages`}
              className="flex items-center px-3 py-2 text-sm font-medium text-[#5774A8] hover:bg-[#E7F5FF] hover:text-[#3161D1] rounded-md"
            >
              <ArrowLeft className="mr-3 h-4 w-4" />
              Back to Pages
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
              <Link
                href={`/site/${siteId}/pages`}
                className="hover:text-[#3161D1]"
              >
                Pages
              </Link>
              <span>›</span>
              <span className="font-medium text-gray-900">Edit Page</span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Eye className="w-4 h-4 mr-2 inline" />
                {isPreview ? "Edit" : "Preview"}
              </button>
              <button
                onClick={handleSave}
                disabled={!isDirty}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2 inline" />
                Save Draft
              </button>
              <button
                onClick={handlePublish}
                className="px-4 py-2 text-sm font-medium text-white rounded-md"
                style={{ backgroundColor: site.theme }}
              >
                Publish
              </button>
            </div>
          </div>
        </header>

        {/* Editor Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Page Settings */}
            <div className="bg-white rounded-lg shadow mb-6 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Page Settings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setIsDirty(true);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter page title..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setIsDirty(true);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="page-url-slug"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Page Content
                </h2>

                {!isPreview && (
                  <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-md">
                    <button
                      onClick={() => insertFormatting("bold")}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300"
                      title="Bold"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => insertFormatting("italic")}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300"
                      title="Italic"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <div className="w-px h-6 bg-gray-300 mx-1"></div>
                    <button
                      onClick={() => insertFormatting("h1")}
                      className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300"
                      title="Heading 1"
                    >
                      H1
                    </button>
                    <button
                      onClick={() => insertFormatting("h2")}
                      className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300"
                      title="Heading 2"
                    >
                      H2
                    </button>
                    <button
                      onClick={() => insertFormatting("p")}
                      className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300"
                      title="Paragraph"
                    >
                      P
                    </button>
                    <div className="w-px h-6 bg-gray-300 mx-1"></div>
                    <button
                      onClick={() => insertFormatting("ul")}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300"
                      title="Bullet List"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => insertFormatting("ol")}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300"
                      title="Numbered List"
                    >
                      <ListOrdered className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => insertFormatting("link")}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded border border-transparent hover:border-gray-300"
                      title="Insert Link"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="p-6">
                {isPreview ? (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                ) : (
                  <textarea
                    id="content-editor"
                    value={content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="Start writing your page content..."
                    className="w-full h-96 p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                  />
                )}
              </div>
            </div>

            {/* Save Status */}
            {isDirty && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-700">
                  You have unsaved changes. Don&apos;t forget to save your work!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProtectedPageEditor() {
  return (
    <AuthGuard>
      <PageEditor />
    </AuthGuard>
  );
}
