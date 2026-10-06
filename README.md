# 🏠 Roman Real Estate 2

Full-Stack real estate marketplace built from scratch as a learning, portfolio, and production-oriented project.

Roman Real Estate 2 simulates a modern real estate platform where users can register, manage profiles, create and manage property listings, search and filter properties, work with agents and agencies, save properties to favorites, and access role-based administrative functionality.

---

## 🚀 Features

### 🔐 Authentication & Security

- Registration & Login
- JWT authentication
- Short-lived Access Tokens
- Refresh Tokens
- HttpOnly refresh-token cookies
- Automatic access-token refresh
- Email verification
- Forgot / Reset password
- Protected API routes
- Authentication middleware
- Authorization for protected resources
- Ownership-based authorization
- Role-based authorization (RBAC)

### 👤 User Profile

- User profile
- Edit profile
- Change email
- Change password
- Avatar upload
- Cloudinary integration

### 🏠 Properties

- Create property
- Edit property
- Delete property
- Property details
- Property gallery
- Property image uploads
- Property ownership
- Ownership-based authorization
- Public property pages
- Personal property pages
- Reusable property cards
- Property features
- Pagination
- Sorting
- Map-based property display
- Location geocoding

### 🔎 Search & Filters

- Location search
- Property type
- Sale / Rent
- Price range
- Area range
- Kitchen area
- Bedrooms
- Sorting
- Pagination
- Combined search & filters

### ❤️ Favorites

- Add property to favorites
- Remove property from favorites
- Favorites page
- Favorite state synchronization
- Authenticated favorite controls
- Unique user/property favorite relation

### 👨‍💼 Agents

- Agents list
- Agent profiles
- Agent details
- Agent properties
- Agent cards
- Agent-related property views

### 🏢 Agencies

- Agencies list
- Agency profiles
- Agency details
- Agency members
- Agency properties
- Agency cards
- Agency member management

### 🛡️ Administration

- Admin role architecture
- Admin authorization middleware
- Admin-only routes
- Admin property management
- User/property permission checks
- Protected administrative operations
- Delete confirmation modal
- Success notifications
- Error notifications
- Loading / disabled action states

---

## 🧩 Reusable Components

The project follows a reusable component approach to reduce duplication and keep the codebase maintainable.

Examples:

- `PropertyCard`
- `PropertyDetails`
- `PropertyGallery`
- `PropertyFeatures`
- `DeletePropertyButton`
- `AgencyCard`
- `AgentCard`
- `BackButton`
- `ConfirmModal`

For example, `PropertyDetails` supports multiple page contexts:

<PropertyDetails property={property} />

Public property page:

- Property information
- Gallery
- Owner information
- Back button
  Personal property page:
  <PropertyDetails
    property={property}
    showActions
  />

Personal actions:

- Add / Remove Favorite
- Edit
- Delete
- All Properties
- Back
  This approach avoids unnecessary duplicated components such as separate PropertyDetailsAll or PropertyCardAll versions.
  🧱 Architecture
  The project uses a PNPM Monorepo + Feature-First Architecture.
  roman-real-estate-2/
  ├── apps/
  │ ├── client/ # Next.js frontend
  │ └── server/ # Node.js / Express backend
  ├── packages/ # Shared packages
  ├── package.json
  ├── pnpm-workspace.yaml
  └── README.md

Backend Architecture
Backend functionality is organized by business domain:
features/
├── admin/
├── agency/
├── auth/
├── favorite/
├── profile/
└── property/

Each feature contains the layers required for that domain:
feature/
├── controllers/
├── dto/
├── middleware/
├── models/
├── repository/
├── routes/
├── services/
└── utils/

Typical request flow:
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

This structure keeps HTTP handling, business logic, database access, validation, and authorization separated.
🖥️ Frontend Architecture
The frontend uses Next.js App Router and a domain-oriented component structure.
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

Application routes are organized by domain:
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

Shared infrastructure includes:

- API layer
- apiFetch
- Authentication handling
- Token refresh logic
- Reusable UI components
- Form validation
- Shared types
  🛠️ Tech Stack
  Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- TanStack Query
- Next/Image
  Backend
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- bcrypt
- Multer
- REST API
  Cloud & Tools
- Cloudinary
- PNPM Workspace
- Git / GitHub
- Postman
- Swagger / API documentation
- ESLint
- Prettier
  🔐 Security & Authorization
  The application uses multiple layers of authentication and authorization.
  Authentication Flow
  Login
  ↓
  Access Token + Refresh Token
  ↓
  HttpOnly Refresh Cookie
  ↓
  Protected API Requests
  ↓
  Automatic Access Token Refresh

Access tokens are short-lived, while refresh tokens are handled through secure HttpOnly cookies.
Ownership Authorization
Property modification is protected by ownership checks:
Authenticated User
↓
Request Property
↓
Find Property
↓
Check Owner
↓
Authorized → Allow
Not Owner → Reject

Role-Based Authorization
Administrative operations are protected on the backend:
Request
↓
Authentication Middleware
↓
Admin Middleware
↓
Admin Route
↓
Controller
↓
Service

Frontend controls are used for UI visibility and UX only.
Actual authorization is enforced by the backend.
🔄 Development Approach
Features are developed as complete vertical slices:
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

The project focuses on understanding the complete lifecycle of a Full-Stack feature rather than only implementing isolated UI functionality.
📈 Current Progress
✅ Implemented

- Product foundation
- Public website
- Responsive UI
- Authentication
- JWT access / refresh tokens
- Automatic token refresh
- Email verification
- Password recovery
- User profiles
- Avatar uploads
- Cloudinary integration
- Property CRUD
- Property ownership authorization
- Property details
- Property gallery
- Property image uploads
- Search & filtering
- Sorting
- Pagination
- Map property display
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
- Success / error notifications
- Loading / disabled action states
  🚧 Production Hardening
  The project is currently moving through the final production-hardening stage:
- Final architecture audit
- Frontend ↔ Backend data-flow audit
- API contract audit
- Error handling audit
- Environment / configuration hardening
- Authentication / security audit
- MongoDB query / index audit
- Frontend performance audit
- Technical debt refactoring
- Final regression testing
- Production baseline
  📌 Planned
- Automated testing
- Expanded API documentation
- Production deployment
- Advanced performance optimization
- Additional security improvements
- Real-time messaging
- Notifications
- Production monitoring
  🎯 Project Goal
  Roman Real Estate 2 is both a practical Full-Stack application and a structured learning path focused on progressing through:
  Junior
  ↓
  Junior+
  ↓
  Strong Junior
  ↓
  Strong Junior+
  ↓
  Middle-ready

The main goal is not simply to make the application work.
The project focuses on understanding:

- Application architecture
- API design
- Client ↔ Server communication
- Databases
- Authentication
- Authorization
- RBAC
- Security
- Validation
- Error handling
- Performance
- Reusable components
- Data flow
- Maintainability
- Production readiness
  🧪 Engineering Mindset
  The project follows the principle:
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

The objective is to understand not only what works, but also:

- Why it works
- Why the architecture was chosen
- What can fail
- How failures are handled
- How the system behaves under real-world conditions
- How the application can evolve without becoming difficult to maintain
  👨‍💻 Author
  Roman Okhremov
  Frontend Developer (React / Next.js / TypeScript)
  with Full-Stack experience
  GitHub:
  https://github.com/RomanFrontEndDeveloper/
  LinkedIn:
  https://www.linkedin.com/in/roman-okhremov-9b0764369/
  Portfolio:
  https://portfolio-react-roman-okhremov.netlify.app/
