"use client";

import { useState, useEffect, useCallback } from "react";
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
    textSecondary: "#6B7280",
  },
  text: {
    fontFamily: "Inter",
    fontSize: "16px",
    lineHeight: "1.5",
    fontWeight: "400",
  },
  buttons: {
    borderRadius: "6px",
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: "500",
  },
  background: {
    mainColor: "#F5F6FA",
    pattern: "none",
    opacity: "1",
  },
  header: {
    backgroundColor: "#FFFFFF",
    textColor: "#1F2937",
    height: "64px",
    borderBottom: "1px solid #E5E7EB",
  },
  footer: {
    backgroundColor: "#F9FAFB",
    textColor: "#6B7280",
    height: "80px",
    borderTop: "1px solid #E5E7EB",
  },
  utilities: {
    shadows: "medium",
    borders: "1px",
    spacing: "normal",
  },
};

interface SiteThemePanelProps {
  siteId: string;
  siteTheme: string;
}

const getStorageKey = (siteId: string) => `site-theme-${siteId}`;

const saveSiteTheme = (siteId: string, theme: ThemeConfig) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(getStorageKey(siteId), JSON.stringify(theme));
  }
};

const loadSiteTheme = (
  siteId: string,
  fallbackPrimaryColor: string
): ThemeConfig => {
  // Check if we're in the browser environment
  if (typeof window === "undefined") {
    return {
      ...defaultTheme,
      colorPalette: {
        ...defaultTheme.colorPalette,
        primary: fallbackPrimaryColor,
      },
    };
  }

  try {
    const stored = localStorage.getItem(getStorageKey(siteId));
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...defaultTheme,
        ...parsed,
        colorPalette: {
          ...defaultTheme.colorPalette,
          ...parsed.colorPalette,
        },
      };
    }
  } catch (error) {
    console.warn("Failed to load site theme:", error);
  }

  // Return default theme with site's primary color
  return {
    ...defaultTheme,
    colorPalette: {
      ...defaultTheme.colorPalette,
      primary: fallbackPrimaryColor,
    },
  };
};

// Export utility function to get saved theme color for use in other components
export const getSavedThemeColor = (
  siteId: string,
  fallbackColor: string
): string => {
  if (typeof window === "undefined") {
    return fallbackColor;
  }

  try {
    const stored = localStorage.getItem(getStorageKey(siteId));
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed?.colorPalette?.primary || fallbackColor;
    }
  } catch (error) {
    console.warn("Failed to load site theme color:", error);
  }

  return fallbackColor;
};

export default function SiteThemePanel({
  siteId,
  siteTheme,
}: SiteThemePanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("colorPalette");
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(() =>
    loadSiteTheme(siteId, siteTheme)
  );

  // Load site-specific theme when siteId changes
  useEffect(() => {
    const siteThemeConfig = loadSiteTheme(siteId, siteTheme);
    setThemeConfig(siteThemeConfig);
  }, [siteId, siteTheme]);

  const updateThemeConfig = (
    section: keyof ThemeConfig,
    key: string,
    value: string
  ) => {
    setThemeConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const resetToDefault = () => {
    const resetTheme = {
      ...defaultTheme,
      colorPalette: {
        ...defaultTheme.colorPalette,
        primary: siteTheme,
      },
    };
    setThemeConfig(resetTheme);
  };

  const saveTheme = () => {
    saveSiteTheme(siteId, themeConfig);
    // Trigger custom event to notify other components of theme change
    window.dispatchEvent(
      new CustomEvent("themeUpdated", {
        detail: { siteId, theme: themeConfig },
      })
    );
    // Show save confirmation or feedback here if needed
    console.log(`Theme saved for site ${siteId}`);
  };

  const applyThemeToDocument = useCallback(() => {
    // Remove any existing theme override style
    const existingStyle = document.getElementById("site-theme-override");
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create and inject dynamic CSS
    const style = document.createElement("style");
    style.id = "site-theme-override";
    style.textContent = `
      :root {
        --color-primary: ${themeConfig.colorPalette.primary} !important;
        --color-secondary: ${themeConfig.colorPalette.secondary} !important;
        --color-accent: ${themeConfig.colorPalette.accent} !important;
        --color-background: ${themeConfig.colorPalette.background} !important;
        --color-surface: ${themeConfig.colorPalette.surface} !important;
        --color-text: ${themeConfig.colorPalette.text} !important;
        --color-text-secondary: ${themeConfig.colorPalette.textSecondary} !important;
        --font-family: ${themeConfig.text.fontFamily} !important;
        --font-size: ${themeConfig.text.fontSize} !important;
        --line-height: ${themeConfig.text.lineHeight} !important;
        --button-border-radius: ${themeConfig.buttons.borderRadius} !important;
        --header-height: ${themeConfig.header.height} !important;
        --footer-height: ${themeConfig.footer.height} !important;
        --header-bg-color: ${themeConfig.header.backgroundColor} !important;
        --header-text-color: ${themeConfig.header.textColor} !important;
        --footer-bg-color: ${themeConfig.footer.backgroundColor} !important;
        --footer-text-color: ${themeConfig.footer.textColor} !important;
        --background-main-color: ${themeConfig.background.mainColor} !important;
      }

      /* Override inline styles that use the original site color */
      [style*="${siteTheme}"] {
        background-color: ${themeConfig.colorPalette.primary} !important;
        border-color: ${themeConfig.colorPalette.primary} !important;
        color: ${themeConfig.colorPalette.primary} !important;
      }

      /* Update specific site elements with dynamic styling */
      .site-theme-dynamic {
        background-color: var(--color-primary) !important;
        color: var(--color-primary) !important;
        border-color: var(--color-primary) !important;
      }

      /* Apply theme to text elements */
      body {
        font-family: var(--font-family) !important;
        font-size: var(--font-size) !important;
        line-height: var(--line-height) !important;
        background-color: var(--background-main-color) !important;
      }

      /* Theme buttons */
      button {
        border-radius: var(--button-border-radius) !important;
      }
    `;

    document.head.appendChild(style);

    // Force repaint by slightly changing a harmless style property
    document.body.style.transform = "translateZ(0)";
    requestAnimationFrame(() => {
      document.body.style.transform = "";
    });
  }, [themeConfig, siteTheme]);

  // Apply theme on mount and when config changes (persistent theme)
  useEffect(() => {
    applyThemeToDocument();
  }, [themeConfig, applyThemeToDocument]);

  // Apply theme immediately when panel is opened for live preview
  useEffect(() => {
    if (isOpen) {
      applyThemeToDocument();
    }
  }, [isOpen, applyThemeToDocument]);

  const sections = [
    { id: "colorPalette", label: "Color Palette", icon: Palette },
    { id: "text", label: "Text", icon: Type },
    { id: "buttons", label: "Buttons", icon: Square },
    { id: "background", label: "Background", icon: Layers },
    { id: "header", label: "Header", icon: Monitor },
    { id: "footer", label: "Footer", icon: Layout },
    { id: "utilities", label: "Utilities", icon: Code },
  ];

  const renderColorPalette = () => (
    <div className="space-y-4">
      {Object.entries(themeConfig.colorPalette).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 capitalize">
            {key.replace(/([A-Z])/g, " $1").trim()}
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={value}
              onChange={(e) =>
                updateThemeConfig("colorPalette", key, e.target.value)
              }
              className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={value}
              onChange={(e) =>
                updateThemeConfig("colorPalette", key, e.target.value)
              }
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Font Family
        </label>
        <select
          value={themeConfig.text.fontFamily}
          onChange={(e) =>
            updateThemeConfig("text", "fontFamily", e.target.value)
          }
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Font Size
        </label>
        <select
          value={themeConfig.text.fontSize}
          onChange={(e) =>
            updateThemeConfig("text", "fontSize", e.target.value)
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Line Height
        </label>
        <select
          value={themeConfig.text.lineHeight}
          onChange={(e) =>
            updateThemeConfig("text", "lineHeight", e.target.value)
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="1.3">1.3</option>
          <option value="1.5">1.5</option>
          <option value="1.6">1.6</option>
          <option value="1.8">1.8</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Font Weight
        </label>
        <select
          value={themeConfig.text.fontWeight}
          onChange={(e) =>
            updateThemeConfig("text", "fontWeight", e.target.value)
          }
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Border Radius
        </label>
        <select
          value={themeConfig.buttons.borderRadius}
          onChange={(e) =>
            updateThemeConfig("buttons", "borderRadius", e.target.value)
          }
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Padding
        </label>
        <select
          value={themeConfig.buttons.padding}
          onChange={(e) =>
            updateThemeConfig("buttons", "padding", e.target.value)
          }
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
        <label className="text-sm font-medium text-gray-700">
          Background Color
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={themeConfig.background.mainColor}
            onChange={(e) =>
              updateThemeConfig("background", "mainColor", e.target.value)
            }
            className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={themeConfig.background.mainColor}
            onChange={(e) =>
              updateThemeConfig("background", "mainColor", e.target.value)
            }
            className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Pattern
        </label>
        <select
          value={themeConfig.background.pattern}
          onChange={(e) =>
            updateThemeConfig("background", "pattern", e.target.value)
          }
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
        <label className="text-sm font-medium text-gray-700">
          Background Color
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={themeConfig.header.backgroundColor}
            onChange={(e) =>
              updateThemeConfig("header", "backgroundColor", e.target.value)
            }
            className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={themeConfig.header.backgroundColor}
            onChange={(e) =>
              updateThemeConfig("header", "backgroundColor", e.target.value)
            }
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
            onChange={(e) =>
              updateThemeConfig("header", "textColor", e.target.value)
            }
            className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={themeConfig.header.textColor}
            onChange={(e) =>
              updateThemeConfig("header", "textColor", e.target.value)
            }
            className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Height
        </label>
        <select
          value={themeConfig.header.height}
          onChange={(e) =>
            updateThemeConfig("header", "height", e.target.value)
          }
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
        <label className="text-sm font-medium text-gray-700">
          Background Color
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={themeConfig.footer.backgroundColor}
            onChange={(e) =>
              updateThemeConfig("footer", "backgroundColor", e.target.value)
            }
            className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={themeConfig.footer.backgroundColor}
            onChange={(e) =>
              updateThemeConfig("footer", "backgroundColor", e.target.value)
            }
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
            onChange={(e) =>
              updateThemeConfig("footer", "textColor", e.target.value)
            }
            className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={themeConfig.footer.textColor}
            onChange={(e) =>
              updateThemeConfig("footer", "textColor", e.target.value)
            }
            className="w-20 px-2 py-1 text-xs border border-gray-300 rounded"
          />
        </div>
      </div>
    </div>
  );

  const renderUtilitiesSettings = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Shadow Intensity
        </label>
        <select
          value={themeConfig.utilities.shadows}
          onChange={(e) =>
            updateThemeConfig("utilities", "shadows", e.target.value)
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="none">None</option>
          <option value="light">Light</option>
          <option value="medium">Medium</option>
          <option value="strong">Strong</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Border Width
        </label>
        <select
          value={themeConfig.utilities.borders}
          onChange={(e) =>
            updateThemeConfig("utilities", "borders", e.target.value)
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="0px">None</option>
          <option value="1px">Thin (1px)</option>
          <option value="2px">Medium (2px)</option>
          <option value="3px">Thick (3px)</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Spacing
        </label>
        <select
          value={themeConfig.utilities.spacing}
          onChange={(e) =>
            updateThemeConfig("utilities", "spacing", e.target.value)
          }
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
      case "colorPalette":
        return renderColorPalette();
      case "text":
        return renderTextSettings();
      case "buttons":
        return renderButtonSettings();
      case "background":
        return renderBackgroundSettings();
      case "header":
        return renderHeaderSettings();
      case "footer":
        return renderFooterSettings();
      case "utilities":
        return renderUtilitiesSettings();
      default:
        return renderColorPalette();
    }
  };

  return (
    <>
      {/* Floating Theme Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow z-40 flex items-center justify-center"
        style={{ backgroundColor: themeConfig.colorPalette.primary }}
        title="Site Theme"
      >
        <Palette className="w-6 h-6 text-white" />
      </button>

      {/* Theme Panel */}
      {isOpen && (
        <>
          {/* Close overlay - positioned to not cover the main content */}
          <div
            className="fixed inset-0 z-40 bg-transparent"
            onClick={() => setIsOpen(false)}
          />

          {/* Theme Panel */}
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out z-50">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Site Theme
                  </h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Section Navigation */}
            <div className="border-b border-gray-100">
              <nav className="px-6 py-0">
                <div className="space-y-1">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center px-3 py-3 text-sm font-medium transition-colors ${
                          activeSection === section.id
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-3" />
                        {section.label}
                      </button>
                    );
                  })}
                </div>
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {renderSectionContent()}
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-100 p-6">
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={resetToDefault}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw className="w-4 h-4 mr-2 inline" />
                  Reset
                </button>
                <button
                  onClick={saveTheme}
                  className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors"
                  style={{ backgroundColor: themeConfig.colorPalette.primary }}
                >
                  <Save className="w-4 h-4 mr-2 inline" />
                  Save
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
