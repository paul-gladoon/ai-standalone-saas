"use client";

import { useState, useEffect } from "react";
import {
  Palette,
  X,
  Type,
  Square,
  Layers,
  Monitor,
  Layout,
  Code,
  RotateCcw,
  Save,
  Eye
} from "lucide-react";

interface ThemeConfig {
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  text: {
    fontFamily: string;
    fontSize: string;
    lineHeight: string;
    fontWeight: string;
  };
  buttons: {
    borderRadius: string;
    padding: string;
    fontSize: string;
    fontWeight: string;
  };
  background: {
    mainColor: string;
    pattern: string;
    opacity: string;
  };
  header: {
    backgroundColor: string;
    textColor: string;
    height: string;
    borderBottom: string;
  };
  footer: {
    backgroundColor: string;
    textColor: string;
    height: string;
    borderTop: string;
  };
  utilities: {
    shadows: string;
    borders: string;
    spacing: string;
  };
}

const defaultTheme: ThemeConfig = {
  colorPalette: {
    primary: "#3161D1",
    secondary: "#5774A8",
    accent: "#10B981",
    background: "#F5F6FA",
    surface: "#FFFFFF",
    text: "#1F2937",
    textSecondary: "#6B7280"
  },
  text: {
    fontFamily: "Inter",
    fontSize: "16px",
    lineHeight: "1.5",
    fontWeight: "400"
  },
  buttons: {
    borderRadius: "6px",
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: "500"
  },
  background: {
    mainColor: "#F5F6FA",
    pattern: "none",
    opacity: "1"
  },
  header: {
    backgroundColor: "#FFFFFF",
    textColor: "#1F2937",
    height: "64px",
    borderBottom: "1px solid #E5E7EB"
  },
  footer: {
    backgroundColor: "#F9FAFB",
    textColor: "#6B7280",
    height: "80px",
    borderTop: "1px solid #E5E7EB"
  },
  utilities: {
    shadows: "medium",
    borders: "1px",
    spacing: "normal"
  }
};

interface SiteThemePanelProps {
  siteId: string;
  siteName: string;
  siteTheme: string;
}

export default function SiteThemePanel({ siteId, siteName, siteTheme }: SiteThemePanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("colorPalette");
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(defaultTheme);
  const [isPreview, setIsPreview] = useState(false);

  // Initialize theme with site's primary color
  useEffect(() => {
    setThemeConfig(prev => ({
      ...prev,
      colorPalette: {
        ...prev.colorPalette,
        primary: siteTheme
      }
    }));
  }, [siteTheme]);

  const updateThemeConfig = (section: keyof ThemeConfig, key: string, value: string) => {
    setThemeConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const resetToDefault = () => {
    setThemeConfig({
      ...defaultTheme,
      colorPalette: {
        ...defaultTheme.colorPalette,
        primary: siteTheme
      }
    });
  };

  const applyThemeToDocument = () => {
    const root = document.documentElement;

    // Apply CSS custom properties
    root.style.setProperty('--color-primary', themeConfig.colorPalette.primary);
    root.style.setProperty('--color-secondary', themeConfig.colorPalette.secondary);
    root.style.setProperty('--color-accent', themeConfig.colorPalette.accent);
    root.style.setProperty('--color-background', themeConfig.colorPalette.background);
    root.style.setProperty('--color-surface', themeConfig.colorPalette.surface);
    root.style.setProperty('--color-text', themeConfig.colorPalette.text);
    root.style.setProperty('--color-text-secondary', themeConfig.colorPalette.textSecondary);

    // Apply other theme properties
    root.style.setProperty('--font-family', themeConfig.text.fontFamily);
    root.style.setProperty('--font-size', themeConfig.text.fontSize);
    root.style.setProperty('--line-height', themeConfig.text.lineHeight);
    root.style.setProperty('--button-border-radius', themeConfig.buttons.borderRadius);
    root.style.setProperty('--header-height', themeConfig.header.height);
    root.style.setProperty('--footer-height', themeConfig.footer.height);
  };

  useEffect(() => {
    if (isPreview) {
      applyThemeToDocument();
    }
  }, [themeConfig, isPreview]);

  const sections = [
    { id: "colorPalette", label: "Color Palette", icon: Palette },
    { id: "text", label: "Text", icon: Type },
    { id: "buttons", label: "Buttons", icon: Square },
    { id: "background", label: "Background", icon: Layers },
    { id: "header", label: "Header", icon: Monitor },
    { id: "footer", label: "Footer", icon: Layout },
    { id: "utilities", label: "Utilities", icon: Code }
  ];

  const renderColorPalette = () => (
    <div className="space-y-4">
      {Object.entries(themeConfig.colorPalette).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 capitalize">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={value}
              onChange={(e) => updateThemeConfig("colorPalette", key, e.target.value)}
              className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => updateThemeConfig("colorPalette", key, e.target.value)}
              className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderTextSettings = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
        <select
          value={themeConfig.text.fontFamily}
          onChange={(e) => updateThemeConfig("text", "fontFamily", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="Inter">Inter</option>
          <option value="Roboto">Roboto</option>
          <option value="Open Sans">Open Sans</option>
          <option value="Poppins">Poppins</option>
          <option value="Lato">Lato</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
        <select
          value={themeConfig.text.fontSize}
          onChange={(e) => updateThemeConfig("text", "fontSize", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Line Height</label>
        <select
          value={themeConfig.text.lineHeight}
          onChange={(e) => updateThemeConfig("text", "lineHeight", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="1.3">1.3</option>
          <option value="1.5">1.5</option>
          <option value="1.6">1.6</option>
          <option value="1.8">1.8</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Font Weight</label>
        <select
          value={themeConfig.text.fontWeight}
          onChange={(e) => updateThemeConfig("text", "fontWeight", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="300">Light (300)</option>
          <option value="400">Normal (400)</option>
          <option value="500">Medium (500)</option>
          <option value="600">Semi Bold (600)</option>
          <option value="700">Bold (700)</option>
        </select>
      </div>
    </div>
  );

  const renderButtonSettings = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Border Radius</label>
        <select
          value={themeConfig.buttons.borderRadius}
          onChange={(e) => updateThemeConfig("buttons", "borderRadius", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="0px">Sharp (0px)</option>
          <option value="4px">Small (4px)</option>
          <option value="6px">Medium (6px)</option>
          <option value="8px">Large (8px)</option>
          <option value="12px">Extra Large (12px)</option>
          <option value="50px">Pill (50px)</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Padding</label>
        <select
          value={themeConfig.buttons.padding}
          onChange={(e) => updateThemeConfig("buttons", "padding", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="6px 12px">Small</option>
          <option value="8px 16px">Medium</option>
          <option value="12px 24px">Large</option>
          <option value="16px 32px">Extra Large</option>
        </select>
      </div>
    </div>
  );

  const renderBackgroundSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Background Color</label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={themeConfig.background.mainColor}
            onChange={(e) => updateThemeConfig("background", "mainColor", e.target.value)}
            className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={themeConfig.background.mainColor}
            onChange={(e) => updateThemeConfig("background", "mainColor", e.target.value)}
            className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Pattern</label>
        <select
          value={themeConfig.background.pattern}
          onChange={(e) => updateThemeConfig("background", "pattern", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="none">None</option>
          <option value="dots">Dots</option>
          <option value="grid">Grid</option>
          <option value="stripes">Stripes</option>
        </select>
      </div>
    </div>
  );

  const renderHeaderSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Background Color</label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={themeConfig.header.backgroundColor}
            onChange={(e) => updateThemeConfig("header", "backgroundColor", e.target.value)}
            className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={themeConfig.header.backgroundColor}
            onChange={(e) => updateThemeConfig("header", "backgroundColor", e.target.value)}
            className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Text Color</label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={themeConfig.header.textColor}
            onChange={(e) => updateThemeConfig("header", "textColor", e.target.value)}
            className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={themeConfig.header.textColor}
            onChange={(e) => updateThemeConfig("header", "textColor", e.target.value)}
            className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
        <select
          value={themeConfig.header.height}
          onChange={(e) => updateThemeConfig("header", "height", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="48px">Compact (48px)</option>
          <option value="64px">Normal (64px)</option>
          <option value="80px">Large (80px)</option>
          <option value="96px">Extra Large (96px)</option>
        </select>
      </div>
    </div>
  );

  const renderFooterSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Background Color</label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={themeConfig.footer.backgroundColor}
            onChange={(e) => updateThemeConfig("footer", "backgroundColor", e.target.value)}
            className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={themeConfig.footer.backgroundColor}
            onChange={(e) => updateThemeConfig("footer", "backgroundColor", e.target.value)}
            className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Text Color</label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={themeConfig.footer.textColor}
            onChange={(e) => updateThemeConfig("footer", "textColor", e.target.value)}
            className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={themeConfig.footer.textColor}
            onChange={(e) => updateThemeConfig("footer", "textColor", e.target.value)}
            className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
          />
        </div>
      </div>
    </div>
  );

  const renderUtilitiesSettings = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Shadow Intensity</label>
        <select
          value={themeConfig.utilities.shadows}
          onChange={(e) => updateThemeConfig("utilities", "shadows", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="none">None</option>
          <option value="light">Light</option>
          <option value="medium">Medium</option>
          <option value="strong">Strong</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Border Width</label>
        <select
          value={themeConfig.utilities.borders}
          onChange={(e) => updateThemeConfig("utilities", "borders", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="0px">None</option>
          <option value="1px">Thin (1px)</option>
          <option value="2px">Medium (2px)</option>
          <option value="3px">Thick (3px)</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Spacing</label>
        <select
          value={themeConfig.utilities.spacing}
          onChange={(e) => updateThemeConfig("utilities", "spacing", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="compact">Compact</option>
          <option value="normal">Normal</option>
          <option value="spacious">Spacious</option>
        </select>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case "colorPalette": return renderColorPalette();
      case "text": return renderTextSettings();
      case "buttons": return renderButtonSettings();
      case "background": return renderBackgroundSettings();
      case "header": return renderHeaderSettings();
      case "footer": return renderFooterSettings();
      case "utilities": return renderUtilitiesSettings();
      default: return renderColorPalette();
    }
  };

  return (
    <>
      {/* Floating Theme Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow z-40 flex items-center justify-center"
        style={{ backgroundColor: siteTheme }}
        title="Site Theme"
      >
        <Palette className="w-6 h-6 text-white" />
      </button>

      {/* Theme Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />

          <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Site Theme</h2>
                  <p className="text-sm text-gray-600">{siteName}</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 mt-4">
                <button
                  onClick={() => setIsPreview(!isPreview)}
                  className={`px-3 py-2 text-xs font-medium rounded-md ${
                    isPreview
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  <Eye className="w-3 h-3 mr-1 inline" />
                  {isPreview ? 'Previewing' : 'Preview'}
                </button>
                <button
                  onClick={resetToDefault}
                  className="px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200"
                >
                  <RotateCcw className="w-3 h-3 mr-1 inline" />
                  Reset
                </button>
                <button
                  className="px-3 py-2 text-xs font-medium text-white rounded-md"
                  style={{ backgroundColor: siteTheme }}
                >
                  <Save className="w-3 h-3 mr-1 inline" />
                  Save
                </button>
              </div>
            </div>

            {/* Section Navigation */}
            <div className="border-b border-gray-200">
              <nav className="px-4 py-2">
                <div className="grid grid-cols-2 gap-1">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`flex items-center px-3 py-2 text-xs font-medium rounded-md ${
                          activeSection === section.id
                            ? 'text-blue-700 bg-blue-100'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-3 h-3 mr-2" />
                        {section.label}
                      </button>
                    );
                  })}
                </div>
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {renderSectionContent()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}