# ShortPoint Standalone - Product Requirements Document

## 1. Elevator Pitch

ShortPoint Standalone is a SaaS intranet solution designed for small to medium businesses that need to organize departmental information and create custom sites for different teams. Similar to Wix for hosting, ShortPoint Standalone allows companies to create multiple sites from a single tenant, where each department (HR, Finance, IT, Development, Sales) can have their own dedicated site with controlled access. Administrators can manage sites from a central dashboard at the tenant level, and also manage specific site settings, pages, themes, and assets at the individual site level.

## 2. Who is this app for

**Primary Users:**
- Small to medium businesses (SMBs) looking for organized intranet solutions
- Company administrators who need to manage multiple departmental sites
- Department users who need access to their specific team's information and resources

**User Roles:**
- **Admin Users**: Full control over tenant configuration, site creation, user management, and all site settings
- **Normal Users**: Access to assigned departmental sites with ability to view and interact with content

## 3. Functional Requirements

### Core Platform Features
- Multi-tenant architecture supporting multiple sites per organization
- User authentication via email/password, Google, and Facebook SSO
- Role-based access control (Admin and Normal User roles)
- Cross-departmental site access for users belonging to multiple departments

### Site Management
- Create unlimited sites from root tenant level
- Site-specific configuration and settings management at the site level
- Custom navigation between pages within each site (managed at site level)
- Theme customization including color palettes and visual styling (managed at site level)

### Content Management
- Rich text editor supporting text, images, tables, and advanced formatting
- Page creation and editing capabilities for administrators (managed at site level)
- Version history tracking for all page modifications
- Assets library for storing documents, images, and videos of any type (managed at site level)

### Navigation Structure
**Root Tenant Level (Left Navigation):**
- Site Collections (list of all sites)
- Tenant Configuration
- Licensing Configuration
- Support Contact

**Site Level (Left Navigation):**
- Navigation (custom page navigation - opens navigation structure editor when clicked)
- Pages (table view of all site pages)
- Assets Library (visual library of all site assets)
- Site Team (team management)
- Theme (visual customization options)
- Settings (site-specific configurations)

## 4. User Stories

### Admin User Stories
- As an admin, I want to create multiple sites from the root tenant so I can organize information by department
- As an admin, I want to configure custom navigation for each site through the Navigation structure editor so users can easily find relevant pages
- As an admin, I want to manage user access to specific sites so only relevant team members can access departmental information
- As an admin, I want to customize themes and colors for each site at the site level so they reflect departmental branding
- As an admin, I want to view all site pages in a table format with sortable columns and status information so I can efficiently manage content
- As an admin, I want to create and edit pages using a rich text editor at the site level so I can add comprehensive content
- As an admin, I want to upload and organize assets in a library at the site level so resources are easily accessible
- As an admin, I want to view version history of pages at the site level so I can track changes and revert if needed

### Normal User Stories
- As a normal user, I want to access only the sites I'm assigned to so I see relevant departmental information
- As a normal user, I want to navigate easily between pages within my site so I can find information quickly
- As a normal user, I want to view and download assets from the library so I can access necessary resources
- As a normal user, I want to belong to multiple departments so I can access cross-functional information

### General User Stories
- As a user, I want to authenticate using my email/password, Google, or Facebook account so I can access the platform securely
- As a user, I want the platform to work on web browsers so I can access it from any device with internet

## 5. User Interface

### Root Tenant Dashboard
- **Left Sidebar Navigation**: Fixed sidebar with navigation menu items including:
  - Sites (with site collection overview)
  - Tenant Configuration
  - Licensing Configuration  
  - Support
- **Main Content Area**: Card-based layout displaying site collections in a responsive cards view
  - Each site displayed as a card with department name and visual indicator
  - Cards show site status, recent activity, and quick access actions
  - Clean spacing between cards for easy scanning
- **Header Bar**: Top navigation with:
  - Platform branding/logo
  - Search functionality
  - User profile dropdown with settings and logout
  - Notifications indicator
- **Modern Design Elements**:
  - Clean typography and consistent spacing
  - Card-based interface with subtle shadows
  - Responsive design adapting to different screen sizes
  - Color-coded elements for different site types/departments

### Site Configuration Interface
- **Left Sidebar Navigation**: Fixed sidebar with site management options including:
  - Navigation (manages the navigation bar in main content area - color customizable via Site Theme)
  - Pages (table view of all site pages)
  - Assets Library (visual library of all site assets)  
  - Site Team (team management)
  - Theme (visual customization options)
  - Settings (site-specific configurations)
- **Main Content Area**: 
  - **Customizable Navigation Bar**: Horizontal navigation menu that appears in the main content area
    - Managed and configured through the "Navigation" option in left sidebar
    - Allows custom navigation between pages within the site
    - Color and styling customizable through Site Theme settings
  - **Content Section**: Below the navigation bar, displays the actual page content of any page created in the site's Pages list. Each page's content is rendered here while the horizontal navigation bar remains as a persistent element displayed on every page
  - **Responsive Layout**: Adapts to different screen sizes while maintaining navigation structure
- **Top Header Bar**: Shows current site context, breadcrumb navigation path, and contextual action buttons:
  - **Site Context Display**: Shows which site is currently being managed
  - **Breadcrumb Navigation**: Displays navigation path (e.g., "Site Name > Pages > Edit Page")
  - **Edit Button**: Allows editing of the current page content when viewing a published page
  - **Publish Button**: Publishes draft content or updates to live pages
  - **Additional Action Buttons**: Save, Preview, and other contextual actions based on current view
- **Consistent Design**: Maintains visual consistency with tenant-level dashboard while providing site-specific functionality

### Navigation Structure Editor
When clicking on the "Navigation" option from the left navigation panel:
- **Navigation Structure Display**: The main content area shows the current navigation structure in an editable interface
- **Structure Modification**: Users can modify the navigation structure including:
  - Adding new navigation items
  - Reordering existing navigation items  
  - Editing navigation item labels and links
  - Removing navigation items
  - Creating nested/hierarchical navigation structures
- **Live Preview**: Changes to navigation structure are reflected in the customizable navigation bar
- **Drag & Drop Interface**: Intuitive drag-and-drop functionality for reordering navigation items
- **Link Management**: Each navigation item can be linked to specific pages within the site or external URLs

### Pages Management Interface
When clicking on the "Pages" option from the left navigation panel:
- **Pages Table View**: The main content area displays a comprehensive table of all site pages with the following columns:
  - **Page Name/Title**: The title or name of each page
  - **Status**: Current page status (Published, Draft, Archived, etc.)
  - **Created Date**: When the page was originally created
  - **Modified Date**: Last modification timestamp
  - **Actions**: Action buttons for each page (Edit, Delete, Duplicate, etc.)
- **Table Features**:
  - Sortable columns for easy organization
  - Search/filter functionality to find specific pages
  - Bulk actions for managing multiple pages at once
  - Pagination for large numbers of pages
- **Page Management Actions**:
  - Quick edit capabilities directly from the table
  - Page status management (publish/unpublish)
  - Page duplication for template creation
  - Page deletion with confirmation dialogs
- **Create New Page**: Prominent button to add new pages to the site

### Page Editor
- Rich text editor interface similar to modern content management systems
- Toolbar with formatting options, media insertion, and table creation
- Preview mode to see page appearance before publishing
- Version history panel accessible from editor interface

### Assets Library
- Visual grid layout for easy browsing of uploaded files
- Filter and search capabilities by file type, name, or date
- Upload area with drag-and-drop functionality
- Preview capabilities for images and documents

### Theme Customization
- Color picker interface for brand customization
- Template selection with live preview
- Typography and spacing controls
- Site navigation bar styling and color customization
- Mobile responsiveness preview options

**Platform Specifications:**
- Web application only (initial release)
- Responsive design for desktop and tablet viewing
- Modern browser compatibility (Chrome, Firefox, Safari, Edge)
- No mobile app or desktop application in initial scope
- No analytics or reporting features in initial release
- No third-party integrations (Dropbox, Google Drive) in initial scope