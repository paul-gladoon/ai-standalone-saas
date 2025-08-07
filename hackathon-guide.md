# ShortPoint Standalone - Hackathon Instructions Guide

## Project Overview

**ShortPoint Standalone** is a multi-tenant SaaS intranet solution designed for small to medium businesses. Think of it as "Wix for internal company sites" - allowing organizations to create multiple departmental sites (HR, Finance, IT, Development, Sales) from a single tenant dashboard with controlled access and customization.

## 🎯 What You're Building

### Core Concept
- **Multi-tenant architecture** where each company is a tenant
- **Multiple sites per tenant** - one for each department
- **Role-based access control** - Admin users manage everything, Normal users access assigned sites
- **Rich content management** with pages, navigation, themes, and assets
- **Real-time collaboration** features for content editing

### Key User Flows
1. **Admin Flow**: Login → Dashboard → Create/Manage Sites → Configure Navigation → Create Pages → Customize Themes (Implementation focus should be on the Admin Flow) (Focus of the immplementation)
2. **Normal User Flow**: Login → Access Assigned Sites → View Content → Interact with Resources

## Resources

**Figma design** - https://www.figma.com/design/0dGmhJD0XMayjRrVVdQbpA/ShortPoint-Standalone-Dashboard?node-id=498-24071&m=dev

**Specifications Files** - on Slack #working-with-ai-channel
- **Design Specs**: `ux-design-specifications.md`
- **Product Requirements**: `standalone-product-specifications.md`
- **Technical Specs**: `.software-requirements-specification.md`
- **File Structure**: `.files-and-folder-structure-best-practises.md`
- **Database Rules**: `.database-integration-best-practises.md`
  + Other rules and screenshots 

## Getting Started: Initial Setup

## Prerequisites

### Step 1: Project Setup
1. **Create a new folder** on your local disk and open it Cursor.
2. **Install Next.js** in the folder (you can ask AI to help you with the install):
   ```bash
   npx create-next-app@latest .
   ```

### Step 2: Documentation Setup
3. **Create a `.documentation` folder** and add the project documentation files available on slack. 
   - `standalone-product-specifications.md`
   - `software-requirements-specification.md`
   - `ux-design-specifications.md`

   **Make sure you go through these documents to understand the specifications**

### Step 3: AI Configuration
4. **Add Cursor rules for AI** in `.cursor/rules` folder (some rules will be provided as a base):
   - `files-and-folder-structure-best-practises.md`
   - `database-integration-best-practises.md`
   - `clerck-setup-specifications.md`

### Step 4. Add Screen shots for reference for the UI
5. **Add screen shots for personal reference and also to feed to AI** in `.documentation/screenshots`

### Step 5: Repository Setup
6. **Push your repository to remote** as a private repository and make sure you commit your changes as often as possible. 
   **Hint**: Use separate branches to implement different features, this will help you move back to the initial code easily if things go wrong.

### Step 6: Set Prototyping Mode (Recomended, but not mandatory)
7. **Add this note to your AI** to inform it about the development approach:

> **PROTOTYPING MODE INSTRUCTIONS FOR AI:**
> - We are in prototyping mode
> - Develop frontend only, we are mocking up the interface
> - Use mock data to represent data
> - Link all components for navigation
> - Make buttons responsive
> - Don't connect to backend logic
> - Initially, don't connect to a database - use mock data only until UI implementation is complete

### Step 7: Get Next Steps
8. **Ask your AI**: Provide the context of the `.documentation` folder" and ask AI what should be the first step of the implementation and go with the flow.

--------------------------------

## Development Approach: Design Mode First

**IMPORTANT**: Follow this development sequence to maximize your success in the hackathon:

### Phase 1: Design & UI Development (Priority #1)
Start in **design mode** - focus entirely on creating the user interface with mock data before any database integration.

#### 📝 Key Features to Implement

##### Priority 1 (MVP)
1. **Tenant Dashboard** - Site collections overview
2. **Site Home Page View** - Home page structure with Side bar and Top Horizontal Navigation
3. **Site Pages View** - Table view with create/edit/delete functionality
4. **Navigation Builder** - Drag-and-drop menu creation

##### Priority 2 (Enhanced)
1. **Theme Customization** - Color and style controls
2. **Asset Management Page** - File upload and organization
3. **Rich Text Editor** - WYSIWYG editor for page content
4. **Site Settings** - Logo and Favicon + other customizations
5. **Version History** - Page Version history View

### Phase 2: Core Functionality (After UI is Complete)
Only after achieving satisfactory UI implementation:

#### 2.1 Database Integration
- Set up Prisma ORM with the provided schema
- Implement database operations **ONLY through Prisma client**
- Create CRUD operations for:
  - Sites creation and management
  - Pages creation and editing
  - Asset library functionality
  - Theme customization storage

#### 2.2 Required Database Operations
- **Site Management**: Create, read, update, delete sites
- **Page Management**: Create, edit, publish pages with rich text content
- **Asset Management**: Upload, organize, and manage files
- **Theme Storage**: Save and apply custom themes per site

### Phase 3: Authentication Integration (Final Step, Optional)
**Leave Clerk integration for the END** - implement one of these alternatives:

#### Option A: Provide Test Credentials
- Create a simple username/password system for demo purposes
- Provide us with test credentials: `username: admin` / `password: demo123`
- This allows easy access without complex authentication setup

#### Option B: Auto-Assign User to Existing Tenant
- Implement automatic user assignment to a pre-existing tenant
- Skip the complex domain-based tenant assignment logic
- Use a default tenant for all users during the hackathon

## Tips for Success

1. **Start Simple**: Get basic UI working before adding complexity
2. **Use Mock Data**: Don't get stuck on database setup early on
3. **Focus on Core UX**: Nail the essential user experience first
4. **Incremental Development**: Build one feature completely before moving to the next. Also try to work on isolated features and split the work with your team mate.
5. **Test Frequently**: Ensure each feature works before proceeding


## Submission Requirements

1. Use `ngrok` to forward your local port on a public domain. You will need to sign up and follow the instractions from the setup page: 
`https://dashboard.ngrok.com/get-started/setup/windows`. 

Make sure you pick the static domain and you run ngrok command on the port you are running your local app (usually 3000)
`ngrok http --url=premium-drake-jolly.ngrok-free.app 3000`


2. Provide the link in the Hackathon slack channel.
3. Make sure your app will remain runing on your local host after the end of the Hackathon
4. Make sure you have a working application with as many UI components implemented
5. Make sure the app is demo-ready with mock data or basic database integration
6. Provide test credentials in case we cannot sign up and login with @shortpoint mail.
7. Provide a brief documentation of implemented features and achievements (Use AI to generate this)

Remember: **Design first, database second, authentication last!** Good luck! 🚀