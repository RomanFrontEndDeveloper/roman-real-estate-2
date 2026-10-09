# 🏠 Roman Real Estate 2

A full-stack real estate marketplace built from scratch as a learning, portfolio, and production-oriented project.

Roman Real Estate 2 simulates a modern real estate platform where users can register, manage profiles, create and manage property listings, search and filter properties, work with agents and agencies, save properties to favorites, and access role-based administrative functionality.

---

## 🚀 Features

### 🔐 Authentication & Security

- User registration and login
- JWT authentication
- Short-lived access tokens
- Refresh tokens
- HttpOnly refresh-token cookies
- Automatic access-token refresh
- Direct account activation on registration
- Forgot-password and reset-password flows
- Protected API routes
- Authentication middleware
- Authorization for protected resources
- Ownership-based authorization
- Role-Based Access Control (RBAC)
- Admin-only protected routes

### 👤 User Profile

- View and edit user profile
- Change email
- Change password
- Avatar upload
- Cloudinary integration

### 🏠 Properties

- Create, edit, and delete property listings
- Property details pages
- Property image gallery and uploads
- Property ownership and ownership-based authorization
- Public property pages
- Personal property pages
- Reusable property cards
- Property features
- Pagination and sorting
- Map-based property display
- Location geocoding

### 🔎 Search & Filters

- Location search
- Property type
- Sale or rent
- Price range
- Total area range
- Kitchen area
- Number of bedrooms
- Sorting
- Pagination
- Combined search and filtering

### ❤️ Favorites

- Add properties to favorites
- Remove properties from favorites
- Dedicated favorites page
- Favorite-state synchronization
- Authenticated favorite controls
- Unique user/property favorite relationship

### 👨‍💼 Agents

- Agents list
- Agent profiles and details
- Agent property listings
- Reusable agent cards
- Agent-related property views

### 🏢 Agencies

- Agencies list
- Agency profiles and details
- Agency members
- Agency property listings
- Reusable agency cards
- Agency member management

### 🛡️ Administration

- Admin role architecture
- Admin authentication and authorization
- Admin authorization middleware
- Admin-only routes
- Admin property management
- User and property permission checks
- Protected administrative operations
- Delete confirmation modal
- Success and error notifications
- Loading and disabled action states

---

## 🧩 Reusable Components

The project uses reusable components to reduce duplication and keep the codebase maintainable.

Examples include:

- `PropertyCard`
- `PropertyDetails`
- `PropertyGallery`
- `PropertyFeatures`
- `DeletePropertyButton`
- `AgencyCard`
- `AgentCard`
- `BackButton`
- `ConfirmModal`

For example, `PropertyDetails` can support different page contexts without creating duplicate components such as `PropertyDetailsAll` or `PropertyCardAll`.

**Public property page:**

```tsx
<PropertyDetails property={property} />
```

This context can display property information, the gallery, owner information, and a back button.

**Personal property page:**

```tsx
<PropertyDetails property={property} showActions />
```

Depending on the page context, personal actions can include adding or removing a favorite, editing or deleting the listing, returning to all properties, and navigating back.

This approach keeps presentation reusable while allowing page-specific actions to be controlled through props.

---

## 🧱 Architecture

The project uses a **PNPM monorepo** with a **feature-first backend architecture** and a domain-oriented frontend structure.

### Monorepo structure

```text
roman-real-estate-2/
├── apps/
│   ├── client/                 # Next.js frontend
│   └── server/                 # Node.js / Express backend
├── packages/                   # Shared packages
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

### Backend architecture

Backend functionality is organized by business domain:

```text
features/
├── admin/
├── agency/
├── auth/
├── favorite/
├── profile/
└── property/
```

A typical feature can contain the layers required for that domain:

```text
feature/
├── controllers/
├── dto/
├── middleware/
├── models/
├── repository/
├── routes/
├── services/
└── utils/
```

Not every feature necessarily needs every folder. The goal is to separate responsibilities where that separation improves clarity and maintainability.

### Typical request flow

```text
Client
  ↓
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
MongoDB
```

This separation helps keep HTTP handling, business logic, database access, validation, authentication, and authorization organized by responsibility.

### Frontend architecture

The frontend uses the **Next.js App Router** and a domain-oriented component structure.

```text
components/
├── agency/
├── agent/
├── auth/
├── favorites/
├── layout/
├── map/
├── profile/
├── property/
├── sections/
└── ui/
```

Application routes are organized by domain:

```text
app/
├── about/
├── admin/
├── agency/
├── agents/
├── allproperty/
├── favorites/
├── forgot-password/
├── login/
├── profile/
├── property/
├── register/
├── reset-password/
└── verify-email/
```

Shared frontend infrastructure includes:

- API layer
- `apiFetch`
- Authentication handling
- Automatic token refresh
- Reusable UI components
- Form validation
- Shared types
- TanStack Query integration

---

## 🛠️ Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- TanStack Query
- Next.js Image

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt
- Multer
- REST API
- Swagger / OpenAPI
- Morgan

### Cloud & Development Tools

- Cloudinary
- PNPM Workspace
- Git and GitHub
- Postman
- Swagger UI
- ESLint
- Prettier

---

## 📘 API Documentation — Swagger

The backend uses **Swagger UI with the OpenAPI specification** to document and explore the REST API.

Swagger provides an interactive API reference that can describe available endpoints, HTTP methods, parameters, request bodies, response formats, and authentication requirements. It helps developers understand the API contract and test supported endpoints without manually constructing every request in a separate tool.

Typical benefits include:

- Centralized REST API documentation
- Clear descriptions of endpoints and request/response schemas
- An interactive interface for trying documented API operations
- Easier frontend/backend integration
- A convenient reference for development and debugging

When the backend server is running locally, open the Swagger UI route configured by the server. For example, if Swagger is mounted at `/api-docs` and the backend runs on port `5000`, the URL is:

```text
http://localhost:5000/api-docs
```

The exact path depends on the Express configuration. The `/api-docs` URL should only be used if that is the route configured in the project.

Swagger UI is a development and documentation tool; it does **not** replace runtime validation, authentication middleware, authorization checks, or automated tests. An endpoint must still enforce its own security and validation rules on the server.

---

## 📝 HTTP Request Logging — Morgan

The backend uses **Morgan**, an HTTP request logger middleware for Express, to log incoming HTTP requests and their responses.

Morgan helps make backend activity visible during development. It can show information such as the HTTP method, request URL, response status code, response size, and response time, depending on the logging format selected.

Typical benefits include:

- Seeing which API endpoints are being requested
- Checking HTTP response status codes
- Diagnosing failed or unexpected requests
- Observing request duration during development
- Making API debugging easier

Morgan is usually registered as Express middleware, before the routes whose requests should be logged. For example:

```ts
import express from "express";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));

// Register other middleware and routes after the logger.
```

The `dev` format provides concise, colorized request logs in supported terminals. The actual format and middleware order should match the project's server setup.

Morgan is an **HTTP request logger**, not a complete application monitoring or error-tracking platform. Avoid logging passwords, access tokens, refresh tokens, cookies, or other sensitive data. In production, select an appropriate logging format and consider the application's privacy and operational requirements.

---

## 🔐 Security & Authorization

The application uses multiple layers of authentication and authorization.

### Authentication flow

```text
Login
  ↓
Access Token + Refresh Token
  ↓
Refresh Token stored in an HttpOnly cookie
  ↓
Protected API requests use the Access Token
  ↓
Access Token expires
  ↓
Refresh flow requests a new Access Token
```

Access tokens are short-lived, while refresh tokens are stored in HttpOnly cookies. The client-side API layer handles access-token refresh when required.

### Ownership-based authorization

Property modification is protected by ownership checks:

```text
Authenticated User
  ↓
Request Property
  ↓
Find Property
  ↓
Check Owner
  ↓
Owner → Allow operation
Not owner → Reject operation
```

### Role-based authorization

Administrative operations are protected on the backend:

```text
Request
  ↓
Authentication Middleware
  ↓
Admin Authorization Middleware
  ↓
Admin Route
  ↓
Controller
  ↓
Service
```

Frontend controls are used for visibility and user experience only. Actual authorization must be enforced by the backend.

---

## 🛡️ Production Hardening

Before reaching the production baseline, the project went through a hardening pass covering:

- Final architecture audit
- Frontend ↔ backend data-flow audit
- API contract audit
- Error-handling audit
- Environment and configuration review
- Authentication and security review
- MongoDB query and index review
- Frontend performance review
- Technical-debt refactoring
- Production build verification

### Production Baseline v1.0

The current baseline includes:

- Centralized API request handling
- Automatic access-token refresh
- Strongly typed property update flow
- Backend request validation
- Ownership-based authorization
- Role-based authorization
- Centralized error handling
- Environment-based configuration
- Protected refresh-token cookies
- MongoDB query and index baseline
- Pagination and API result limits
- Production client and server build verification

This baseline represents the current project milestone; it should not be interpreted as a claim that every production concern has been fully solved. Deployment configuration, automated tests, monitoring, and ongoing security reviews remain important parts of production readiness.

---

## 🔄 Development Approach

Features are developed as complete vertical slices:

```text
UI
  ↓
API
  ↓
Database
  ↓
Integration
  ↓
Validation
  ↓
Authentication / Authorization
  ↓
Testing
  ↓
Refactoring
  ↓
Commit
```

The project focuses on understanding the complete lifecycle of a full-stack feature rather than implementing isolated UI functionality only.

---

## 📈 Current Progress

### ✅ Implemented

- Product foundation
- Public website
- Responsive UI
- Authentication
- JWT access and refresh tokens
- Automatic token refresh
- Direct account activation on registration
- Password recovery
- User profiles
- Avatar uploads
- Cloudinary integration
- Property CRUD
- Property ownership authorization
- Property details
- Property gallery
- Property image uploads
- Search and filtering
- Sorting
- Pagination
- Map-based property display
- Location geocoding
- Favorites
- Agents
- Agencies
- Agency members
- Reusable property components
- Public and personal property views
- Admin role architecture
- Admin authorization middleware
- Admin-only routes
- Admin property management
- RBAC foundations
- Delete confirmation modal
- Success and error notifications
- Loading and disabled action states
- Final production-hardening pass
- Production Baseline v1.0
- Swagger / API documentation
- Morgan HTTP request logging

### 🚧 Next Development Stage

The next stage focuses on expanding the project toward stronger production and Middle-level engineering practices:

- Automated testing
- Expanded API documentation
- Production deployment
- Advanced performance optimization
- Additional security improvements
- Real-time messaging
- Notifications
- Further production observability

---

## 🎯 Project Goal

Roman Real Estate 2 is both a practical full-stack application and a structured learning path focused on progressing through:

```text
Junior
  ↓
Junior+
  ↓
Strong Junior
  ↓
Strong Junior+
  ↓
Middle-ready
```

The goal is not simply to make the application work. The project is designed to develop a deeper understanding of:

- Application architecture
- API design
- Client ↔ server communication
- Databases
- Authentication
- Authorization
- Role-Based Access Control (RBAC)
- Security
- Validation
- Error handling
- Performance
- Reusable components
- Data flow
- Maintainability
- Production readiness

---

## 🧪 Engineering Mindset

The project follows this cycle:

```text
Learn
  ↓
Implement
  ↓
Test
  ↓
Break
  ↓
Fix
  ↓
Optimize
  ↓
Deploy
  ↓
Explain
```

The objective is to understand not only what works, but also:

- Why it works
- Why the architecture was chosen
- What can fail
- How failures are handled
- How the system behaves under real-world conditions
- How the application can evolve without becoming difficult to maintain

---

## 🚀 Project Status

**Current milestone: Production Baseline v1.0 completed.**

The next planned stage is:

```text
Roman Real Estate 2
  ↓
Production Baseline v1.0
  ↓
Production Deployment
  ↓
Further Production & Middle-level Engineering
```

---

## 👨‍💻 Author

**Roman Okhremov**  
Frontend Developer (React / Next.js / TypeScript) with Full-Stack experience

- **GitHub:** https://github.com/RomanFrontEndDeveloper/
- **LinkedIn:** https://www.linkedin.com/in/roman-okhremov-9b0764369/
- **Portfolio:** https://portfolio-react-roman-okhremov.netlify.app/
