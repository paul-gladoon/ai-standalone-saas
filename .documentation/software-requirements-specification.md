# Software Requirements Specification
## ShortPoint Standalone - SaaS Intranet Solution

---

## System Design

- **Multi-tenant SaaS architecture** with isolated data per organization
- **Hierarchical structure**: Tenant → Sites → Pages → Content
- **Role-based access control** with Admin and Normal user permissions
- **Responsive web application** with mobile-first design approach
- **Real-time collaborative editing** for content management
- **Asset management system** with file upload and organization
- **Theme customization engine** with live preview capabilities

---

## Architecture Pattern

- **Single Page Application (SPA)** with Next.js App Router and client-side routing
- **Component-based architecture** using React functional components
- **Atomic design methodology** for UI component organization
- **API-first approach** with RESTful endpoints
- **Middleware-based authentication** and authorization
- **Single database** with tenant-based data isolation via foreign keys
- **Event-driven updates** for real-time collaboration

---

## State Management

- **Zustand stores** for global application state
- **Server state caching** with React Query/TanStack Query
- **Local component state** with React useState/useReducer
- **Form state management** with React Hook Form
- **Authentication state** managed by Clerk
- **Theme state** persisted in localStorage and database
- **Navigation state** synchronized across components

---

## Data Flow

- **Client → API Routes → Database** for data operations
- **Clerk → Middleware → Protected Routes** for authentication
- **Zustand → Components** for client-side state updates
- **Database triggers → Real-time subscriptions** for live updates
- **File uploads → Supabase Storage → Database references**
- **Theme changes → Live preview → Database persistence**
- **Navigation updates → Context propagation → UI refresh**

---

## Technical Stack

### Frontend
- **Next.js 14+** with App Router and TypeScript
- **React 18+** with functional components and hooks
- **Tailwind CSS** for styling and responsive design
- **Shadcn/ui** component library for consistent UI
- **Lucide React** for iconography
- **Sonner** for toast notifications
- **React Hook Form** for form management
- **TanStack Query** for server state management

### Backend & Database
- **Next.js API Routes** for backend endpoints
- **Prisma ORM** for database operations and migrations
- **Supabase PostgreSQL** for primary database
- **Supabase Storage** for file and asset management
- **Supabase Real-time** for live collaboration features

### Authentication & Authorization
- **Clerk** for user authentication and management
- **JWT tokens** for API authorization
- **Role-based middleware** for route protection
- **Multi-tenant user isolation** via database queries

### Deployment & Infrastructure
- **Vercel** for hosting and deployment
- **Vercel Edge Functions** for global performance
- **Supabase** for database and storage hosting
- **Environment-based configuration** for different stages

---

## Authentication Process

- **User registration and login** via Clerk (email, Google, Facebook)
- **JWT token generation** and validation
- **Middleware authentication** on protected routes
- **Role assignment** (Admin/Normal) stored in database
- **Domain-based tenant assignment** via email domain matching
- **Multi-site access** based on user permissions
- **Session management** with automatic token refresh
- **Logout** with token invalidation and state cleanup

### Tenant Assignment Strategy

**Domain-based Assignment**: Users are automatically assigned to tenants based on their email domain using the following matching logic:

1. **Direct Domain Match**: Company website contains user's email domain
   - Example: `user@company.com` → tenant with company.website containing "company.com"

2. **Slug-based Match**: Tenant slug matches converted email domain
   - Example: `user@my-company.com` → tenant with slug "my-company-com"

3. **Company Name Match**: Company name contains the domain name
   - Example: `user@acme.com` → tenant with company name containing "acme"

4. **Fallback Assignment**: If no domain match found, assign to first available tenant

**Webhook Processing**: Clerk user creation events trigger automatic user record creation in database with appropriate tenant assignment.

## Data Initialization

- **Built-in seed action** that runs on initial application setup
- **Mock data generation** for tenants, users, sites, and content
- **Pre-configured sample tenants** with realistic demo data
- **Sample user accounts** with various roles and permissions
- **Demo sites and pages** with placeholder content
- **Asset library** populated with sample images and files

---

## Route Design

### Public Routes
- `/` - Landing page
- `/sign-in` - Authentication page

### Dashboard Protected Routes
- `/dashboard` - Root tenant dashboard (Admin only)
- `/dashboard/sites` - Site collections overview
- `/dashboard/tenant-config` - Tenant configuration
- `/dashboard/licensing` - Licensing management
- `/dashboard/support` - Support contact

### Site-Level Protected Routes
- `/sites/[siteId]` - Site configuration dashboard
- `/sites/[siteId]/navigation` - Navigation structure editor
- `/sites/[siteId]/pages` - Pages management table
- `/sites/[siteId]/pages/[pageId]` - Individual page editor
- `/sites/[siteId]/assets` - Assets library management
- `/sites/[siteId]/team` - Site team management
- `/sites/[siteId]/theme` - Theme customization
- `/sites/[siteId]/settings` - Site-specific settings

---

## API Design

### Authentication Endpoints
- `GET /api/auth/user` - Get current user profile
- `POST /api/auth/role` - Assign user role
- `GET /api/auth/permissions` - Get user permissions

### Tenant Management
- `GET /api/tenants` - Get tenant information
- `PUT /api/tenants/config` - Update tenant configuration
- `GET /api/tenants/sites` - Get all tenant sites

### Site Management
- `POST /api/sites` - Create new site
- `GET /api/sites/[siteId]` - Get site details
- `PUT /api/sites/[siteId]` - Update site configuration
- `DELETE /api/sites/[siteId]` - Delete site

### Page Management
- `GET /api/sites/[siteId]/pages` - Get all site pages
- `POST /api/sites/[siteId]/pages` - Create new page
- `GET /api/sites/[siteId]/pages/[pageId]` - Get page content
- `PUT /api/sites/[siteId]/pages/[pageId]` - Update page content
- `DELETE /api/sites/[siteId]/pages/[pageId]` - Delete page

### Navigation Management
- `GET /api/sites/[siteId]/navigation` - Get navigation structure
- `PUT /api/sites/[siteId]/navigation` - Update navigation structure

### Asset Management
- `GET /api/sites/[siteId]/assets` - Get assets library
- `POST /api/sites/[siteId]/assets` - Upload new asset
- `DELETE /api/sites/[siteId]/assets/[assetId]` - Delete asset

### Theme Management
- `GET /api/sites/[siteId]/theme` - Get theme configuration
- `PUT /api/sites/[siteId]/theme` - Update theme settings

---

## Database Design ERD

### Core Tables

**companies**
- id (UUID, Primary Key)
- name (String)
- slug (String, Unique)
- industry (String)
- website (String)
- created_at (Timestamp)
- updated_at (Timestamp)

**tenants**
- id (UUID, Primary Key)
- name (String)
- slug (String, Unique)
- company_id (UUID, Foreign Key → companies.id)
- created_at (Timestamp)
- updated_at (Timestamp)

**users**
- id (UUID, Primary Key)
- clerk_id (String, Unique)
- email (String, Unique)
- role (Enum: ADMIN, NORMAL)
- tenant_id (UUID, Foreign Key → tenants.id)
- created_at (Timestamp)

**sites**
- id (UUID, Primary Key)
- name (String)
- slug (String)
- description (Text)
- tenant_id (UUID, Foreign Key → tenants.id)
- created_by (UUID, Foreign Key → users.id)
- created_at (Timestamp)
- updated_at (Timestamp)

**pages**
- id (UUID, Primary Key)
- title (String)
- slug (String)
- content (JSON)
- status (Enum: DRAFT, PUBLISHED, ARCHIVED)
- site_id (UUID, Foreign Key → sites.id)
- tenant_id (UUID, Foreign Key → tenants.id)
- created_by (UUID, Foreign Key → users.id)
- created_at (Timestamp)
- updated_at (Timestamp)

**page_versions**
- id (UUID, Primary Key)
- page_id (UUID, Foreign Key → pages.id)
- version_number (Integer)
- title (String)
- content (JSON)
- status (Enum: DRAFT, PUBLISHED, ARCHIVED)
- created_by (UUID, Foreign Key → users.id)
- created_at (Timestamp)
- is_current (Boolean)

**navigation**
- id (UUID, Primary Key)
- site_id (UUID, Foreign Key → sites.id)
- tenant_id (UUID, Foreign Key → tenants.id)
- structure (JSON)
- updated_at (Timestamp)

**assets**
- id (UUID, Primary Key)
- name (String)
- file_path (String)
- file_type (String)
- file_size (Integer)
- site_id (UUID, Foreign Key → sites.id)
- tenant_id (UUID, Foreign Key → tenants.id)
- uploaded_by (UUID, Foreign Key → users.id)
- created_at (Timestamp)

**themes**
- id (UUID, Primary Key)
- site_id (UUID, Foreign Key → sites.id)
- tenant_id (UUID, Foreign Key → tenants.id)
- primary_color (String)
- secondary_color (String)
- custom_css (Text)
- updated_at (Timestamp)

**tenant_licenses**
- id (UUID, Primary Key)
- tenant_id (UUID, Foreign Key → tenants.id)
- license_type (Enum: BASIC, PREMIUM, ENTERPRISE)
- max_sites (Integer)
- max_users (Integer)
- max_storage_gb (Integer)
- start_date (Date)
- end_date (Date)
- is_active (Boolean)
- created_at (Timestamp)
- updated_at (Timestamp)

**site_users** (Many-to-Many)
- site_id (UUID, Foreign Key → sites.id)
- user_id (UUID, Foreign Key → users.id)
- role (Enum: ADMIN, MEMBER)
- created_at (Timestamp)

### Relationships
- **companies** → **tenants** (One-to-Many)
- **tenants** → **tenant_licenses** (One-to-Many)
- **tenants** → **users** (One-to-Many)
- **tenants** → **sites** (One-to-Many)
- **tenants** → **pages** (One-to-Many)
- **tenants** → **assets** (One-to-Many)
- **tenants** → **navigation** (One-to-Many)
- **tenants** → **themes** (One-to-Many)
- **sites** → **pages** (One-to-Many)
- **pages** → **page_versions** (One-to-Many)
- **sites** → **assets** (One-to-Many)
- **sites** → **navigation** (One-to-One)
- **sites** → **themes** (One-to-One)
- **sites** ↔ **users** (Many-to-Many via site_users)