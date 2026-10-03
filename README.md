# 🏠 Roman Real Estate 2

Full-Stack real estate platform built from scratch as a learning and portfolio project.

The application simulates a modern real estate marketplace where users can register, manage profiles, create and manage property listings, search and filter properties, work with agents and agencies, and save properties to favorites.

---

## 🚀 Features

### 🔐 Authentication

- Registration & Login
- JWT authentication
- Access & Refresh Tokens
- HttpOnly refresh-token cookies
- Email verification
- Forgot / Reset password
- Protected routes
- Automatic token refresh
- Authorization for protected resources

### 👤 User Profile

- User profile
- Edit profile
- Avatar upload
- Cloudinary integration

### 🏠 Properties

- Create, Edit & Delete property
- Property details
- Property gallery
- Property ownership & authorization
- Reusable property cards
- Public and personal property pages
- Pagination
- Map-based property display

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

- Add / Remove property from favorites
- Favorites page
- Favorite state synchronization
- Favorite controls for authenticated users

### 👨‍💼 Agents

- Agents list
- Agent profiles
- Agent details
- Agent properties

### 🏢 Agencies

- Agencies list
- Agency profiles
- Agency details
- Agency members
- Agency properties

---

## 🧩 Reusable Components

The project uses reusable components with configurable props to avoid unnecessary duplication.

Examples:

- `PropertyCard`
- `PropertyDetails`
- `BackButton`
- `PropertyGallery`
- `PropertyFeatures`
- `DeletePropertyButton`
- `AgencyCard`
- `AgentCard`

For example, `PropertyDetails` supports different page contexts:

```tsx
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
- All Properties
- Delete
- Back
This approach keeps the codebase maintainable and avoids duplicated components such as separate PropertyDetailsAll or PropertyCardAll versions.
🧱 Architecture
The project uses Monorepo + Feature-First Architecture.
roman-real-estate-2/
├── apps/
│   ├── client/              # Next.js frontend
│   └── server/              # Node.js / Express backend
├── packages/
├── package.json
├── pnpm-workspace.yaml
└── README.md

Backend features are organized by business domain:
features/
├── auth/
├── profile/
├── property/
├── favorite/
└── agency/

Each feature contains related controllers, services, repositories, routes, models, validation, authorization and business logic.
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
- pnpm Workspace
- Git / GitHub
- Postman
- ESLint
- Prettier
🔐 Security & Authorization
The application uses multiple layers of authentication and authorization.
Login
  ↓
Access Token + Refresh Token
  ↓
HttpOnly Refresh Cookie
  ↓
Protected API Requests

The frontend automatically refreshes expired access tokens.
Property modification is protected by ownership checks:
Authenticated User
        ↓
Request Property
        ↓
Check Property Owner
        ↓
Authorized → Allow
Not Owner  → Reject

Frontend controls manage UI visibility, while actual authorization is enforced by the backend.
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

The project focuses on understanding the complete lifecycle of a Full-Stack feature, including architecture, data flow, security, reusable components, error handling and maintainability.
📈 Current Progress
Implemented
- Product foundation
- Public website
- Authentication
- JWT access / refresh tokens
- Email verification
- Password recovery
- User profiles
- Avatar uploads
- Cloudinary integration
- Property CRUD
- Property ownership & authorization
- Property details
- Property gallery
- Search & filtering
- Sorting & pagination
- Map property display
- Favorites
- Agents
- Agencies
- Reusable property components
- Public and personal property views
- Responsive UI
In Progress / Planned
- Messaging
- Real-time communication
- Notifications
- Administration
- RBAC
- Automated testing
- Expanded API documentation
- Production deployment
- Performance optimization
- Additional security improvements
🎯 Project Goal
Roman Real Estate 2 is both a practical Full-Stack project and a structured learning path focused on progressing from:
Junior → Junior+ → Strong Junior → Production-Oriented Full-Stack Developer
The main focus is not only making the application work, but understanding application architecture, API design, databases, authentication, authorization, security, client-server communication, reusable components, validation, error handling and maintainability.
👨‍💻 Author
Roman Okhremov
Frontend Developer (React / Next.js / TypeScript)
with Full-Stack experience
GitHub: https://github.com/RomanFrontEndDeveloper/
LinkedIn: https://www.linkedin.com/in/roman-okhremov-9b0764369/
Portfolio: https://portfolio-react-roman-okhremov.netlify.app/
```
