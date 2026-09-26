# 🏠 Roman Real Estate 2

Full-Stack real estate platform built from scratch as a learning and portfolio project.

The application simulates a modern real estate marketplace where users can register, manage their profiles, create property listings, search and filter properties, work with agents and agencies, and save properties to favorites.

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

### 👤 User Profile

- User profile
- Edit profile
- Avatar upload
- Cloudinary integration

### 🏠 Properties

- Create property
- Edit property
- Delete property
- Property details
- Property gallery
- Property ownership & authorization
- Property cards
- Pagination

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
- Remove from favorites
- Favorites page
- Favorite state synchronization

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

## 🧱 Architecture

The project uses **Monorepo + Feature-First Architecture**.

roman-real-estate-2/
├── apps/
│ ├── client/ # Next.js frontend
│ └── server/ # Node.js / Express backend
│
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

Each feature contains its own controllers, services, repositories, routes, models, validation and related logic.

🛠️ Tech Stack
Frontend
Next.js
React
TypeScript
Tailwind CSS
React Hook Form
Zod
TanStack Query
Next/Image
Backend
Node.js
Express.js
TypeScript
MongoDB
Mongoose
JWT
bcrypt
Multer
Cloud & Tools
Cloudinary
pnpm Workspace
Git / GitHub
Postman
ESLint
Prettier
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
Authentication / Security
↓
Testing
↓
Refactoring
↓
Commit

The goal is to understand the complete lifecycle of a real Full-Stack feature rather than only building isolated components.

📈 Current Progress

Implemented:

Product foundation
Public website
Authentication
User profiles
Property CRUD
Property search & filtering
Sorting & pagination
Agents
Agencies
Favorites

Planned:

Messaging
Real-time communication
Notifications
Administration
RBAC
Automated testing
Swagger / API documentation
Production deployment
Performance & security improvements
🎯 Project Goal

Roman Real Estate 2 is both a practical Full-Stack project and a structured learning path focused on progressing from:

Junior → Junior+ → Strong Junior → Production-Oriented Full-Stack Developer

The main focus is not only making the application work, but understanding architecture, API design, databases, authentication, security, integration, reusable code and maintainability.

👨‍💻 Author

Roman Okhremov

Frontend Developer (React / Next.js / TypeScript)
with Full-Stack experience

GitHub: https://github.com/RomanFrontEndDeveloper/
LinkedIn: https://www.linkedin.com/in/roman-okhremov-9b0764369/
Portfolio: https://portfolio-react-roman-okhremov.netlify.app/
