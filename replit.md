# Overview

This is a full-stack social media application called "Our Squad" - a personal memory-sharing platform where friends can upload photos, create memories, share YouTube videos, and showcase their group. The application features a modern, responsive design with a warm color scheme and smooth animations, built as a single-page application with photo galleries, friend profiles, YouTube integration, and a memories timeline.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**React SPA with Vite**: Single-page application using React 18 with Vite as the build tool for fast development and hot module replacement. The frontend is structured with a component-based architecture using TypeScript for type safety.

**UI Framework**: Built with shadcn/ui components based on Radix UI primitives and styled with Tailwind CSS. The design system uses CSS custom properties for theming with support for light/dark modes and a warm color palette (pinks, yellows, purples).

**State Management**: Uses TanStack Query (React Query) for server state management, caching API responses, and handling loading states. No global client state management library is used.

**Routing**: Implements wouter for client-side routing, though currently only has a home route and 404 page.

**Form Handling**: React Hook Form with Zod validation for type-safe form schemas and validation.

## Backend Architecture

**Express.js Server**: Node.js backend using Express with TypeScript in ES modules. The server handles API routes, file uploads, and serves the frontend in production.

**File Upload System**: Multer middleware for handling image uploads with validation (10MB limit, image types only). Files are stored locally in a `client/uploads` directory and served statically.

**API Design**: RESTful API structure with endpoints for photos, friends, YouTube videos, and memories. Error handling middleware with standardized JSON responses.

**Development Features**: Request logging middleware, Vite integration for development with HMR support.

## Data Storage Solutions

**In-Memory Storage**: Currently uses a memory-based storage system (`MemStorage`) with Maps for data persistence. This is a temporary solution as evidenced by the database configuration present.

**Database Configuration**: Drizzle ORM configured for PostgreSQL with schema definitions for photos, friends, YouTube videos, and memories tables. Migration system is set up but not actively used with the current memory storage.

**Schema Design**: Well-defined TypeScript schemas using Drizzle with Zod validation. Tables include proper relationships and constraints with UUID primary keys and timestamps.

## External Dependencies

**Neon Database**: Configured to use Neon's serverless PostgreSQL offering (@neondatabase/serverless) though not currently active.

**YouTube Integration**: Built-in support for fetching and displaying YouTube channel information and videos, with utilities for formatting duration and view counts.

**UI Component Libraries**: Extensive use of Radix UI primitives (@radix-ui/*) for accessible, unstyled components that are styled with Tailwind CSS.

**Development Tools**: 
- Vite with React plugin for fast development
- Replit-specific plugins for development banner and error overlay
- ESBuild for production bundling
- TypeScript for type checking

**Styling and Fonts**:
- Tailwind CSS for utility-first styling
- Google Fonts integration (Inter, Dancing Script)
- Font Awesome for icons
- Custom CSS variables for theming

The architecture is designed for easy transition from development (memory storage) to production (PostgreSQL database) while maintaining a clean separation between frontend and backend concerns.