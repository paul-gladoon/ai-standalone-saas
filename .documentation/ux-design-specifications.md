# User Interface Design Document
## ShortPoint Standalone - SaaS Intranet Solution

---

## Layout Structure

### Root Tenant Dashboard Layout
- **Fixed Left Sidebar**: 230px width, full height navigation panel with white background and subtle border
- **Main Content Area**: Fluid width container with light gray background (#F5F6FA)
- **Header Bar**: Top-aligned with platform branding, search, user profile dropdown, and notifications
- **Card-Based Content**: Responsive grid layout displaying site collections as cards with shadows and spacing

### Site Configuration Layout
- **Fixed Left Sidebar**: 230px width containing site management navigation options
- **Main Content Area**: Two-tier structure:
  - **Horizontal Navigation Bar**: Customizable navigation menu managed through site settings
  - **Content Section**: Dynamic area displaying page content, management interfaces, or configuration panels
- **Top Header Bar**: Shows current site context, breadcrumb navigation path, and action buttons:
  - **Site Context Display**: Shows which site is currently being managed
  - **Breadcrumb Navigation**: Displays navigation path (e.g., "Site Name > Pages > Edit Page")
  - **Edit Button**: Allows editing of the current page content when viewing a published page
  - **Publish Button**: Publishes draft content or updates to live pages
  - **Additional Action Buttons**: Save, Preview, and other contextual actions
- **Responsive Breakpoints**: Sidebar collapses to hamburger menu on tablets/mobile

---

## Core Components

### Branding & Logo
- **Application Logo**: Located at `/public/shortpoint-logo.svg`
  - Used in sidebar navigation header (160px width, 32px height)
  - SVG format for scalability and quality
  - Primary brand colors: #3161D1 (Primary blue) and #474F65
  - Links to main dashboard when clicked

### Navigation Components
- **Primary Left Navigation**: Fixed sidebar with menu items (Sites, Navigation, Pages, Assets Library, Site Team, Theme, Settings)
  - **Active State**: Light Blue background (#E7F5FF) with Primary Blue text (#3161D1), no borders or border radius
  - **Non-Active State**: Secondary Blue text (#5774A8) with no background, no borders or border radius
  - **Hover State**: Light Blue background with 50% opacity, Primary Blue text (#3161D1), no borders or border radius
  - **Font Size**: 12px with 14px line-height, Inter font family
- **Horizontal Site Navigation**: Configurable top navigation bar with custom links and styling
- **Breadcrumb Navigation**: Contextual path indicator showing current location

### Data Display Components
- **Site Cards**: Visual cards showing department sites with status indicators and quick actions
- **Pages Table**: Comprehensive data table with sortable columns:
  - Page Name/Title
  - Status (Published, Draft, Archived)
  - Created Date
  - Modified Date
  - Actions (Edit, Delete, Duplicate)
- **Assets Grid**: Visual library layout for file management with preview capabilities

### Form & Input Components
- **Rich Text Editor**: Full-featured WYSIWYG editor with formatting toolbar
- **Navigation Structure Editor**: Drag-and-drop interface for menu organization
- **Theme Customization Panel**: Color pickers and style controls
- **Search & Filter Controls**: Input fields with real-time filtering

### Action Components
- **Primary Action Buttons**: Create new site, Add page, Upload assets
- **Page Action Buttons**: 
  - **Edit Button**: Contextual button in top header for editing current page content
  - **Publish Button**: Contextual button in top header for publishing draft content
  - **Save Button**: Saves current changes without publishing
  - **Preview Button**: Shows preview of content before publishing
- **Secondary Actions**: Delete, Duplicate, Publish/Unpublish from management interfaces
- **Bulk Actions**: Multi-select operations for pages and assets

---

## Interaction Patterns

### Navigation Patterns
- **Single-click navigation** for primary menu items
- **Hover states** on interactive elements with subtle color changes
- **Active state indicators** for current page/section (#3161D1 blue accent)
- **Drag-and-drop functionality** for navigation reordering

### Data Management Patterns
- **Inline editing** capabilities for quick content updates
- **Modal dialogs** for confirmations and detailed editing
- **Progressive disclosure** - show basic info first, expand for details
- **Real-time search** with instant filtering as user types

### Content Creation Patterns
- **Step-by-step wizards** for complex setup processes
- **Auto-save functionality** for form inputs and content editing
- **Preview modes** before publishing changes
- **Version history access** through dedicated panels

---

## ShortPoint Design System - Theme Configuration

This section outlines the theming configuration extracted from the Figma design system for the ShortPoint application.

### 🎨 Color Palette

#### Primary Colors
- **Primary Blue**: `#3161D1` - Main brand color, used for primary actions and branding
- **Secondary Blue**: `#5774a8` - Used for secondary text and subtle elements
- **Light Blue**: `#E7F5FF` - Light background for active states and highlights
- **Border Blue**: `#deefff` - Subtle blue border color

#### Background Colors
- **Main Background**: `#f5f6fa` - Dashboard and main application background
- **Card/Panel Background**: `#ffffff` - White background for cards and panels
- **Sidebar Background**: `#ffffff` - White background for sidebar navigation

#### Text Colors
- **Primary Text**: `#202224` - Main text color for headings and important content
- **Subtle Text**: `#5774a8` - Secondary text color for descriptions
- **Brand Text**: `#3161d1` - Text color for brand elements and links
- **Neutral Text**: `#607CAD` - Neutral text color for body content
- **Placeholder Text**: `#ADB5BD` - Gray color for placeholder text

#### Border Colors
- **Light Border**: `#eaeaea` - Light gray border for subtle separations
- **Blue Border**: `#deefff` - Blue border for active states and focus

### 📝 Typography

#### Font Families
- **Inter**: Primary font for UI elements and headings
- **Roboto**: Secondary font for body text and descriptions
- **Euclid Circular A**: Specialized font for certain UI elements

#### Font Sizes
- **XS**: `14px` - Small text, captions
- **SM**: `16px` - Body text, default size
- **MD**: `18px` - Larger body text
- **LG**: `32px` - Headings, titles

#### Font Weights
- **Regular**: `400` - Default text weight
- **Medium**: `500` - Medium emphasis
- **Semibold**: `600` - Strong emphasis, headings

#### Line Heights
- **Tight**: `16px` - Compact line spacing
- **Normal**: `18px` - Standard line spacing
- **Relaxed**: `42px` - Spacious line spacing for headings


### Tailwind Integration
Use these theme configuration to extend the defaul Tailwind theme in `tailwind.config.js`


### 📱 Responsive Design

The theme supports responsive design through:
- Flexible spacing system
- Scalable typography
- Adaptive color usage
- Consistent border radius values

### 🔄 Maintenance

To update the theme:
1. Modify values in `src/lib/theme.ts`
2. Update CSS custom properties in `src/styles/theme.css`
3. Regenerate Tailwind CSS if using the configuration extension
4. Update this documentation

### 🎯 Best Practices

1. **Consistency**: Always use theme values instead of hardcoded colors
2. **Accessibility**: Ensure sufficient contrast ratios between text and background colors
3. **Semantic Usage**: Use color names that reflect their purpose (e.g., `primary-blue` for main actions)
4. **Dark Mode**: Consider extending this theme for dark mode support
5. **Documentation**: Keep this documentation updated when making theme changes 
---

## Mobile, Web App, Desktop Considerations

### Desktop (1200px+)
- **Full sidebar visible** with complete navigation labels
- **Multi-column layouts** for efficient space utilization
- **Hover interactions** and tooltips for enhanced UX
- **Large click targets** (minimum 44px) for all interactive elements

### Tablet (768px - 1199px)
- **Collapsible sidebar** with hamburger menu toggle
- **Condensed table views** with horizontal scrolling if needed
- **Touch-optimized controls** with larger tap targets
- **Simplified navigation** with essential items prioritized

### Mobile (320px - 767px)
- **Full-screen modals** for editing and detailed views
- **Stacked layouts** with single-column arrangements
- **Bottom navigation** for primary actions when appropriate
- **Swipe gestures** for navigation and content management
- **Condensed data tables** with expand/collapse functionality

### Progressive Enhancement
- **Mobile-first approach** with enhanced features for larger screens
- **Flexible grid system** that adapts to any screen size
- **Scalable typography** using relative units (rem/em)
- **Touch and mouse input** compatibility across all devices

---

## Accessibility

### Color & Contrast
- **WCAG AA compliance** with minimum 4.5:1 contrast ratio for normal text
- **WCAG AAA compliance** for important UI elements (7:1 contrast ratio)
- **Color-blind friendly** palette with sufficient contrast differences
- **No color-only indicators** - always paired with text or icons

### Keyboard Navigation
- **Full keyboard accessibility** with logical tab order
- **Visible focus indicators** with clear blue outline
- **Skip links** for main content areas
- **Keyboard shortcuts** for common actions (Ctrl+S for save, etc.)

### Screen Reader Support
- **Semantic HTML** structure with proper heading hierarchy
- **ARIA labels** and descriptions for interactive elements
- **Alt text** for all images and icons
- **Live regions** for dynamic content updates
- **Form labels** properly associated with inputs

### Motor & Cognitive Accessibility
- **Large click targets** (minimum 44px) for all interactive elements
- **Clear error messages** with specific guidance for resolution
- **Consistent navigation** patterns throughout the application
- **Progress indicators** for multi-step processes
- **Undo functionality** for destructive actions
- **Session timeout warnings** with extension options

### Responsive Text & Zoom
- **Text scales** up to 200% without horizontal scrolling
- **Relative units** (rem/em) for flexible sizing
- **Readable fonts** at all zoom levels
- **Layout adapts** gracefully to different text sizes