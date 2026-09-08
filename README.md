# 🏠 Roman Real Estate 2

Full Stack real estate platform built from scratch as a practical learning and portfolio project.

The project is developed using a **Monorepo + Feature-First Architecture** and follows a vertical feature development approach:

**Frontend → Backend → Database → Integration → Validation → Security → Testing → Refactoring → Commit**

---

# 🎯 Project Goal

Roman Real Estate 2 is a practical Full Stack application designed to simulate a real-world real estate platform.

The main goal of the project is to understand how a modern Full Stack application is designed, developed, connected and maintained.

The project focuses on:

- Product architecture
- Frontend development
- Backend development
- REST API design
- Database architecture
- Authentication and authorization
- File uploads
- Cloud storage
- Validation
- Security
- API integration
- Code organization
- Refactoring
- Testing
- Git workflow

The learning path is designed to progress from:

**Junior → Junior+ → Strong Junior**

---

# 🏗️ Architecture

Roman Real Estate 2 uses a **Monorepo + Feature-First Architecture**.

The repository contains separate applications for the frontend and backend.

```text
roman-real-estate-2/
│
├── apps/
│   │
│   ├── client/
│   │   ├── app/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── layout/
│   │   │   ├── profile/
│   │   │   ├── sections/
│   │   │   └── ui/
│   │   ├── lib/
│   │   ├── public/
│   │   └── ...
│   │
│   └── server/
│       ├── src/
│       │   ├── config/
│       │   │
│       │   ├── features/
│       │   │   ├── auth/
│       │   │   │   ├── controllers/
│       │   │   │   ├── dto/
│       │   │   │   ├── middleware/
│       │   │   │   ├── models/
│       │   │   │   ├── repository/
│       │   │   │   ├── routes/
│       │   │   │   ├── services/
│       │   │   │   ├── types/
│       │   │   │   └── utils/
│       │   │   │
│       │   │   └── profile/
│       │   │       ├── controllers/
│       │   │       ├── dto/
│       │   │       ├── middleware/
│       │   │       ├── repository/
│       │   │       ├── routes/
│       │   │       ├── services/
│       │   │       └── utils/
│       │   │
│       │   ├── app.ts
│       │   └── server.ts
│       │
│       └── ...
│
├── packages/
│
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
└── README.md
```

---

# 🧩 Feature-First Architecture

The backend is organized around **business features**, not around one global collection of technical layers.

Current features:

```text
apps/server/src/features/

├── auth/
│   ├── controllers/
│   ├── dto/
│   ├── middleware/
│   ├── models/
│   ├── repository/
│   ├── routes/
│   ├── services/
│   ├── types/
│   └── utils/
│
└── profile/
    ├── controllers/
    ├── dto/
    ├── middleware/
    ├── repository/
    ├── routes/
    ├── services/
    └── utils/
```

Each feature contains the code responsible for its own domain.

For example, the `auth` feature contains:

- Controllers
- DTOs
- Middleware
- Models
- Repository
- Routes
- Services
- Types
- Utilities

The `profile` feature follows the same domain-oriented approach.

This keeps business logic isolated and makes the application easier to extend.

Future domains can be added as independent features:

```text
features/
├── auth/
├── profile/
├── properties/
├── agents/
├── agencies/
├── favorites/
├── messages/
├── notifications/
└── ...
```

---

# 🔄 Feature Development Workflow

Every major feature is developed as a complete vertical slice.

```text
Product Planning
      ↓
Frontend UI
      ↓
Backend API
      ↓
Database
      ↓
Frontend ↔ Backend Integration
      ↓
Validation
      ↓
Authentication / Security
      ↓
Testing
      ↓
Refactoring
      ↓
Git Commit
```

The goal is to finish and understand the complete flow of a feature before moving to the next domain.

---

# 🛠️ Tech Stack

## Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- Next/Image

## Backend

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- JWT
- bcrypt
- Multer
- Cloudinary

## Development

- pnpm
- pnpm Workspace
- Git
- ESLint
- Prettier
- Concurrently
- tsx

---

# 📦 Monorepo

The project uses **pnpm Workspace** to manage the monorepo.

```text
roman-real-estate-2/
│
├── apps/
│   ├── client/
│   └── server/
│
└── packages/
```

### Client

`apps/client`

Next.js application responsible for:

- Pages
- Layouts
- UI
- Forms
- Client-side authentication state
- API communication
- User interaction

### Server

`apps/server`

Express application responsible for:

- REST API
- Authentication
- Business logic
- Database communication
- Validation
- Security
- File uploads
- Cloudinary integration

---

# 🚀 Getting Started

## 1. Install dependencies

```bash
pnpm install
```

## 2. Start development environment

Run frontend and backend together:

```bash
pnpm dev
```

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:5000
```

---

# 📜 Available Scripts

## Development

```bash
pnpm dev
```

Runs the client and server simultaneously.

## Client Development

```bash
pnpm dev:client
```

Starts the Next.js development server.

## Server Development

```bash
pnpm dev:server
```

Starts the Express development server.

## Production Build

```bash
pnpm build
```

Builds both client and server.

## Client Build

```bash
pnpm build:client
```

Builds the Next.js application.

## Server Build

```bash
pnpm build:server
```

Builds the Express/TypeScript application.

## Production Client

```bash
pnpm start:client
```

## Production Server

```bash
pnpm start:server
```

## Lint

```bash
pnpm lint
```

---

# 🌐 Public Website

The public website foundation has been implemented.

Completed functionality:

- Global Layout
- Header
- Navigation
- Responsive Layout
- Design System
- Shared UI Components
- Landing Page
- Hero Section
- Property Search UI
- Featured Properties
- Property Categories
- Popular Locations
- Agents Section
- CTA Sections
- Footer
- Public Website Review
- Refactoring

---

# 🔐 Authentication

The authentication system has been implemented end-to-end.

Completed functionality:

- User Model
- Registration UI
- Registration API
- Registration Integration
- Login UI
- Login API
- Login Integration
- Password Hashing
- JWT Access Token
- Refresh Token
- HttpOnly Refresh Token Cookie
- Authentication Middleware
- Protected Routes
- Current User
- Logout
- Authentication Errors
- Validation
- Complete Authentication Flow
- Authentication Testing
- Automatic Access Token Refresh
- Centralized API Fetch
- Refresh Request Deduplication
- Refactoring

---

# 🔑 JWT Authentication Flow

The application uses two types of tokens:

### Access Token

The access token is short-lived and is used to authenticate API requests.

The frontend stores the access token in:

```text
sessionStorage
```

### Refresh Token

The refresh token is long-lived and is stored in an:

```text
HttpOnly Cookie
```

The refresh token cannot be accessed directly from JavaScript.

---

# ♻️ Automatic Token Refresh

Authenticated API requests are handled through a centralized `apiFetch` helper.

When the access token expires:

```text
API Request
     ↓
401 Unauthorized
     ↓
apiFetch detects 401
     ↓
POST /api/auth/refresh
     ↓
Refresh Token Cookie
     ↓
New Access Token
     ↓
Save Access Token
     ↓
Retry Original Request
     ↓
200 OK
```

The application also uses a shared refresh promise to prevent multiple simultaneous API requests from creating multiple refresh requests.

Example:

```text
Request A → 401
Request B → 401
     ↓
One refresh request
     ↓
New Access Token
     ↓
Request A → retry → 200
Request B → retry → 200
```

---

# 👤 User Profile

The User Profile feature has been implemented as a complete feature block.

Completed functionality:

- Profile Model Extension
- Profile Page
- Current User Data
- Edit Profile
- Profile Validation
- Avatar Upload
- Multer
- Cloudinary
- Avatar Update
- User Preferences
- Account Settings
- Change Email
- Change Password
- Profile Security
- Protected Profile Requests
- Complete Profile Flow
- Profile Testing
- Refactoring

---

# 🖼️ Avatar Upload

The avatar upload flow connects the frontend, backend, Cloudinary and MongoDB.

```text
Profile Form
      ↓
Multipart/Form-Data
      ↓
Multer
      ↓
Cloudinary
      ↓
Image URL + Public ID
      ↓
MongoDB
      ↓
Updated User
      ↓
Profile UI
```

The frontend uses Next.js `Image` for displaying uploaded avatars.

---

# 🧩 Shared UI Components

The client contains reusable UI components to avoid unnecessary duplication.

Current shared components include:

- Button
- Input
- Card

Layout components include:

- Header
- Footer

Feature-specific components include:

- LoginForm
- RegisterForm
- ProfileCard
- EditProfileForm
- AccountSettings

---

# 🏠 Current Project Stage

```text
Product Foundation
        ↓
Public Website
        ↓
Authentication
        ↓
User Profile
        ↓
Property Domain
        ↓
Agents & Agencies
        ↓
Favorites
        ↓
Messaging
        ↓
Notifications
        ↓
Admin
        ↓
Testing & Production
```

The current completed foundation consists of:

**Product Foundation + Public Website + Authentication + User Profile**

The next major domain is the **Property** feature.

---

# 🚧 Upcoming Features

Planned features include:

## Property Domain

- Property Model
- Property CRUD
- Property Validation
- Property Images
- Property Details
- Property Search
- Search Filters
- Property Categories
- Locations
- Property Ownership
- Property Status

## Favorites

- Add Property to Favorites
- Remove Property from Favorites
- Favorites Page
- Favorite State

## Agents

- Agent Profiles
- Agent Listings
- Agent Search
- Agent Details

## Agencies

- Agency Model
- Agency Profiles
- Agency Properties
- Agency Management

## Messaging

- Conversations
- Messages
- Real-time Communication
- Socket.io

## Notifications

- In-App Notifications
- Email Notifications
- Real-Time Notifications

## Administration

- Admin Dashboard
- User Management
- Property Management
- Role-Based Access Control
- Moderation

## Production

- Automated Testing
- API Documentation
- Swagger
- Security Hardening
- Performance Optimization
- Error Monitoring
- Production Deployment

---

# 🔒 Security

Security is treated as part of each feature rather than as a separate final step.

Current security-related implementation includes:

- Password hashing
- JWT authentication
- Access and refresh token separation
- HttpOnly refresh-token cookies
- Authentication middleware
- Protected routes
- Request validation
- Authentication error handling
- Token expiration
- Automatic token refresh

Security will continue to be improved as new features are added.

---

# 🧪 Testing & Quality

Each completed feature is manually tested end-to-end during development.

The development process includes:

- API testing
- Authentication testing
- Protected route testing
- Form validation testing
- Token expiration testing
- Refresh token testing
- Frontend ↔ Backend integration testing
- Refactoring
- Linting
- Production builds

The project is continuously refactored as the architecture evolves.

---

# 🔧 Refactoring Philosophy

Refactoring is considered a normal part of development.

The goal is not simply to make a feature work, but to improve:

- Code readability
- Separation of responsibilities
- Reusability
- Maintainability
- Type safety
- Architecture
- Error handling
- API consistency

For example, repeated authenticated `fetch` logic was centralized into:

```text
apps/client/lib/apiFetch.ts
```

This allows authentication-related behavior to be handled consistently across the application.

---

# 📈 Learning Path

The project is designed around progressive Full Stack development:

```text
Junior
   ↓
Junior+
   ↓
Strong Junior
   ↓
Production-Oriented Full Stack Developer
```

The emphasis is on understanding the complete lifecycle of a feature:

```text
Idea
 ↓
Architecture
 ↓
UI
 ↓
API
 ↓
Database
 ↓
Integration
 ↓
Security
 ↓
Testing
 ↓
Refactoring
 ↓
Production
```

---

# 👨‍💻 Author

**Roman Okhremov**

Roman Real Estate 2 — Full Stack Learning & Portfolio Project.
