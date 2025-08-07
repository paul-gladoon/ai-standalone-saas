Implementation Requirements

IMPORTANT: Follow this development sequence to maximize your success in the hackathon:

Phase 1: Design & UI Development (Priority #1)

:point_right:Recommendation: Start in design mode - focus on creating the user interface with mock data before any database integration.

📝 Key Features to Implement

Priority 1 (MVP)

    1. Tenant Dashboard - Site collections overview
    2. Site Home Page View - Home page structure with Side bar and Top Horizontal Navigation
    3. Site Pages View - Table view with create/edit/delete functionality
    4. Navigation Builder - Drag-and-drop menu creation


Priority 2 (Enhanced)

    1. Theme Customization - Color and style controls
    2. Asset Management Page - File upload and organization
    3. Rich Text Editor - WYSIWYG editor for page content
    4. Site Settings - Logo and Favicon + other customizations
    5. Version History - Page Version history View

Phase 2: Core Functionality

Recommendation: Only after achieving satisfactory UI implementation:
2.1 Database Integration

* Use Supabase for database integration (Recommended but you could choose Convex DB as well)

* Set up Prisma ORM (for Supabase option) with the provided schema
* Implement database operations ONLY through Prisma client


2.2 Required Database Operations

* Site Management: Create, read, update, delete sites
* Page Management: Create, edit, publish pages with rich text content
* Asset Management: Upload, organize, and manage files
* Theme Storage: Save and apply custom themes per site

Phase 3: Authentication Integration (Final Step, Optional)

Clerk integration for the END - implement one of these alternatives:

Option A: Provide Test Credentials

* Create a simple username/password system for demo purposes
* Provide us with test credentials: username: admin / password: demo123
* This allows easy access without complex authentication setup


Option B: Gmail auth - Auto-Assign User to Existing Tenant

* Implement automatic user assignment to a pre-existing tenant
* Skip the complex domain-based tenant assignment logic