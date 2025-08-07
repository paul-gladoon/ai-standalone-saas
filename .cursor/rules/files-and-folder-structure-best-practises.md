# Files and Folder Structure Best Practices

## Multi-Tenant SaaS Next.js 14+ Application Structure

This document outlines the recommended folder structure for our multi-tenant SaaS application built with Next.js 14, Prisma, Clerk, and modern React patterns.

## Complete Folder Structure

```
standalone/
├── src/
│   ├── app/                          # App Router (Next.js 14+)
│   │   ├── (tenant)/                 # Route group for tenant-level routes (authenticated)
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── sites/
│   │   │   │   ├── tenant-config/
│   │   │   │   ├── licensing/
│   │   │   │   └── support/
│   │   │   └── layout.tsx
│   │   ├── (site)/                   # Route group for site-level routes (authenticated)
│   │   │   ├── sites/
│   │   │   │   └── [siteId]/
│   │   │   │       ├── page.tsx
│   │   │   │       ├── navigation/
│   │   │   │       ├── pages/
│   │   │   │       │   └── [pageId]/
│   │   │   │       ├── assets/
│   │   │   │       ├── team/
│   │   │   │       ├── theme/
│   │   │   │       └── settings/
│   │   │   ├── s/                    # Public site viewing (authenticated users only)
│   │   │   │   └── [siteSlug]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── [pageSlug]/
│   │   │   └── layout.tsx
│   │   ├── sign-in/                  # Authentication route (no route group)
│   │   │   └── [[...rest]]/
│   │   │       └── page.tsx
│   │   ├── api/                      # API routes
│   │   │   ├── auth/
│   │   │   │   ├── user/
│   │   │   │   ├── role/
│   │   │   │   └── permissions/
│   │   │   ├── tenants/
│   │   │   │   ├── route.ts
│   │   │   │   ├── config/
│   │   │   │   └── sites/
│   │   │   ├── sites/
│   │   │   │   └── [siteId]/
│   │   │   │       ├── route.ts
│   │   │   │       ├── pages/
│   │   │   │       ├── navigation/
│   │   │   │       ├── assets/
│   │   │   │       └── theme/
│   │   │   └── webhooks/
│   │   │       └── clerk/
│   │   ├── globals.css
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Homepage
│   ├── components/                   # Shared components
│   │   ├── ui/                       # Base UI components (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   └── toast.tsx
│   │   ├── features/                 # Feature-based components
│   │   │   ├── auth/
│   │   │   │   ├── sign-in-form.tsx
│   │   │   │   └── user-profile.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── dashboard-stats.tsx
│   │   │   │   └── tenant-overview.tsx
│   │   │   ├── site-builder/
│   │   │   │   ├── page-editor.tsx
│   │   │   │   ├── navigation-builder.tsx
│   │   │   │   └── theme-customizer.tsx
│   │   │   ├── tenant-management/
│   │   │   │   ├── tenant-settings.tsx
│   │   │   │   └── license-manager.tsx
│   │   │   └── navigation/
│   │   │       ├── main-nav.tsx
│   │   │       └── site-nav.tsx
│   │   └── layout/                   # Layout components
│   │       ├── header.tsx
│   │       ├── sidebar.tsx
│   │       ├── footer.tsx
│   │       └── breadcrumbs.tsx
│   ├── lib/                          # Utility functions and configurations
│   │   ├── auth.ts                   # Clerk configuration
│   │   ├── db.ts                     # Prisma client
│   │   ├── tenant.ts                 # Tenant utilities
│   │   ├── utils.ts                  # General utilities
│   │   ├── validations.ts            # Zod schemas
│   │   └── constants.ts              # Application constants
│   ├── hooks/                        # Custom React hooks
│   │   ├── use-tenant.ts
│   │   ├── use-auth.ts
│   │   ├── use-sites.ts
│   │   └── use-local-storage.ts
│   ├── stores/                       # Zustand stores
│   │   ├── auth-store.ts
│   │   ├── tenant-store.ts
│   │   ├── theme-store.ts
│   │   └── navigation-store.ts
│   ├── types/                        # TypeScript type definitions
│   │   ├── auth.ts
│   │   ├── tenant.ts
│   │   ├── site.ts
│   │   └── api.ts
│   └── data/                         # Data access layer
│       ├── seed/                     # Seed data and scripts
│       │   ├── mock-data.ts
│       │   ├── seed.ts
│       │   └── companies.json
│       ├── tenants.ts
│       ├── sites.ts
│       ├── pages.ts
│       └── users.ts
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/
│   ├── shortpoint-logo.svg             # Main application logo (used in sidebar navigation)
│   ├── images/
│   │   ├── logos/
│   │   └── placeholders/
│   ├── icons/
│   └── favicon.ico
├── .documentation/
│   ├── .rules/
│   └── software-requirements-specification.md
├── .env.local
├── .env.example
├── middleware.ts                     # Tenant routing & auth middleware
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## Key Principles

### 1. App Router Structure
- Use Next.js 14+ App Router for file-based routing
- Organize routes with route groups `()` for logical separation
- Keep `page.tsx`, `layout.tsx`, and `loading.tsx` files at appropriate levels

### 2. Route Groups
- `(tenant)`: Tenant-level protected routes requiring authentication (dashboard, tenant config, etc.)
- `(site)`: Site-level protected routes requiring authentication (site management, public site viewing)
- All routes require authentication - no public access
- Groups don't affect URL structure but provide logical organization

### 3. Component Organization
- **ui/**: Reusable base components (shadcn/ui components)
- **features/**: Business logic components organized by domain
- **layout/**: Layout-specific components (headers, sidebars, etc.)

### 4. Feature-Based Architecture
- Organize components by business domain rather than technical type
- Each feature folder contains related components, hooks, and utilities
- Promotes modularity and easier maintenance

### 5. Data Layer Separation
- **lib/**: Core utilities and configurations
- **data/**: Database access functions and business logic
- **stores/**: Client-side state management (Zustand)
- **hooks/**: Reusable React hooks

### 6. TypeScript Organization
- **types/**: Centralized type definitions
- Group related types in files by domain
- Export types that are used across multiple modules

## Best Practices

### File Naming Conventions
- Use kebab-case for file names: `user-profile.tsx`
- Use PascalCase for component names: `UserProfile`
- Use camelCase for functions and variables
- Use SCREAMING_SNAKE_CASE for constants

### Import Organization
```typescript
// 1. React imports
import React from 'react'
import { useState, useEffect } from 'react'

// 2. Third-party imports
import { clsx } from 'clsx'
import { useAuth } from '@clerk/nextjs'

// 3. Internal imports (absolute paths)
import { Button } from '@/components/ui/button'
import { useTenant } from '@/hooks/use-tenant'
import { cn } from '@/lib/utils'

// 4. Relative imports
import './styles.css'
```

### Component Structure
```typescript
// 1. Types and interfaces
interface ComponentProps {
  // ...
}

// 2. Component definition
export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // 3. Hooks
  const [state, setState] = useState()
  
  // 4. Effects
  useEffect(() => {
    // ...
  }, [])
  
  // 5. Event handlers
  const handleClick = () => {
    // ...
  }
  
  // 6. Render
  return (
    // JSX
  )
}
```

### Anti-Patterns to Avoid

1. **Deep Nesting**: Avoid paths longer than 4-5 levels
2. **Monolithic Files**: Keep files focused and under 200 lines
3. **Mixed Concerns**: Don't mix UI components with business logic
4. **Global State Overuse**: Use local state when possible
5. **Circular Dependencies**: Maintain clear import hierarchies

## Multi-Tenant Specific Patterns

### Tenant Context
- Use middleware for tenant identification
- Store tenant context in Zustand store
- Pass tenant ID to all database queries

### Route Protection
- All routes require authentication except `/sign-in`
- Implement tenant-aware middleware for all authenticated routes
- Validate user access to tenant resources
- Site viewing (`/s/[siteSlug]`) requires authentication but allows cross-tenant access

### Data Isolation
- Use tenant_id in all database queries
- Implement row-level security in database
- Validate tenant ownership in API routes

## Seed Data Organization

### Mock Data Structure
- **companies.json**: Sample company data
- **mock-data.ts**: TypeScript mock data generators
- **seed.ts**: Database seeding logic

### Seeding Strategy
- Generate realistic sample data
- Create multiple tenants with different configurations
- Include sample users, sites, pages, and assets
- Maintain referential integrity in seed data
- **Required Company**: Include a company called "ShortPoint" for Clerk login integration
  - Company domain: "shortpoint.com" 
  - Used for domain-based tenant assignment logic
  - Test Gmail accounts should use @shortpoint domain for proper tenant association

This structure promotes scalability, maintainability, and follows modern Next.js 14+ best practices for multi-tenant SaaS applications.