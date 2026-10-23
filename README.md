# 🏠 Roman Real Estate 2

A full-stack real estate marketplace built from scratch with **Next.js, Express, TypeScript and MongoDB**, designed around production-oriented practices: layered backend architecture, JWT authentication with refresh tokens, role-based access control, Redis caching, automated tests and API documentation.

Users can register, manage profiles, publish and manage property listings, search and filter on a map, save favorites, browse agents and agencies, and use admin tools protected by RBAC.

> **Status:** Production Baseline v1.0 completed. Next: production deployment, expanded test coverage, real-time messaging.

---

## ✨ Highlights

- **Secure auth:** short-lived JWT access tokens, refresh tokens in HttpOnly cookies, automatic silent refresh on the client.
- **Authorization at two levels:** ownership checks (only the owner can edit or delete a listing) and Role-Based Access Control for admin operations, always enforced on the backend.
- **Clean backend architecture:** feature-first structure with Route → Middleware → Controller → Service → Repository → MongoDB.
- **Performance:** Redis cache for property search (cache hit/miss verified, 60 s TTL), MongoDB indexes, pagination with API result limits, lazy-loaded and optimized images via `next/image`.
- **Quality:** 59 passing server unit tests (Redis mocked, so tests run without infrastructure), strict TypeScript, ESLint and Prettier, centralized error handling.
- **Developer experience:** PNPM monorepo, Swagger/OpenAPI docs, Morgan request logging, Dockerized Redis for local development.

---

## 🛠️ Tech Stack

| Layer                  | Technologies                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| **Frontend**           | Next.js (App Router), React, TypeScript, Tailwind CSS, React Hook Form, Zod, TanStack Query |
| **Backend**            | Node.js, Express.js, TypeScript, MongoDB, Mongoose, JWT, bcrypt, Multer                     |
| **Caching**            | Redis (Docker `redis:alpine`)                                                               |
| **Real-time**          | Socket.IO (foundation for messaging, in progress)                                           |
| **API docs & logging** | Swagger UI / OpenAPI, Morgan                                                                |
| **Cloud & tooling**    | Cloudinary, Docker, PNPM workspaces, Git/GitHub, Postman, ESLint, Prettier                  |

---

## 🚀 Features

### 🔐 Authentication & Security

- Registration and login with direct account activation
- JWT access tokens + refresh tokens in HttpOnly cookies, automatic token refresh
- Forgot-password and reset-password flows
- Authentication middleware, protected routes
- Ownership-based authorization and Role-Based Access Control (RBAC)

### 👤 User Profile

- View and edit profile, change email and password
- Avatar upload via Cloudinary

### 🏠 Properties

- Create, edit and delete listings with image gallery and uploads
- Public and personal property pages
- Map-based display with location geocoding
- Property features, pagination and sorting

### 🔎 Search & Filters

- Location, property type, sale or rent
- Price range, total area range, kitchen area, bedrooms
- Combined filtering with sorting and pagination

### ❤️ Favorites

- Add and remove favorites, dedicated favorites page
- Favorite state synchronized across the UI
- Unique user/property relationship enforced in the database

### 👨‍💼 Agents & 🏢 Agencies

- Agents and agencies lists, profile and detail pages
- Property listings per agent and per agency
- Agency member management

### 🛡️ Administration

- Admin role architecture with admin-only routes and middleware
- Admin property management
- Delete confirmation modal, success and error notifications, loading and disabled states

---

## 🧱 Architecture

PNPM monorepo with a **feature-first backend** and a **domain-oriented frontend**.

```text
roman-real-estate-2/
├── apps/
│   ├── client/        # Next.js frontend
│   └── server/        # Node.js / Express backend
├── packages/          # Shared packages
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

### Backend

```text
features/
├── admin/
├── agency/
├── auth/
├── favorite/
├── profile/
└── property/
```

Each feature contains only the layers it needs (`controllers`, `dto`, `middleware`, `models`, `repository`, `routes`, `services`, `utils`).

```text
Client → Route → Middleware → Controller → Service → Repository → MongoDB
```

This keeps HTTP handling, business logic, data access, validation and authorization separated by responsibility.

### Frontend

```text
components/  agency · agent · auth · favorites · layout · map · profile · property · sections · ui
app/         about · admin · agency · agents · allproperty · favorites · forgot-password · login · profile · property · register · reset-password
```

Shared infrastructure: central `apiFetch` API layer with automatic token refresh, TanStack Query, form validation (React Hook Form + Zod), shared types and reusable UI components.

### Reusable components

`PropertyCard`, `PropertyDetails`, `PropertyGallery`, `PropertyFeatures`, `AgencyCard`, `AgentCard`, `ConfirmModal`, `DeletePropertyButton`, `BackButton`.

Page-specific behavior is controlled through props instead of duplicating components:

```tsx
<PropertyDetails property={property} />              {/* public page */}
<PropertyDetails property={property} showActions />  {/* owner page: edit, delete, favorite */}
```

---

## 🔐 Security & Authorization

```text
Login → Access Token + Refresh Token (HttpOnly cookie)
      → Protected requests use the Access Token
      → Token expires → refresh flow issues a new Access Token
```

**Ownership-based authorization:** find property → check owner → allow or reject.

**Role-based authorization:** Request → Authentication middleware → Admin authorization middleware → Controller → Service.

Frontend controls only affect visibility and UX; **all authorization is enforced on the backend.**

---

## ⚡ Redis Caching

Property search results are cached to reduce MongoDB load.

- **Cache key:** built from filters, sorting, pagination and page size
- **TTL:** 60 seconds
- **Flow:** cache hit returns instantly; cache miss queries MongoDB and stores the result
- **Reusable utility:** `getOrSetCache` wraps the check-then-fetch logic
- **Resilience:** Redis client errors are logged
- **Testing:** Redis is mocked in unit tests

**Key files**

- `apps/server/src/shared/redis/redis.client.ts`: client configuration
- `apps/server/src/shared/redis/redis-cache.ts`: caching utility
- `apps/server/src/features/property/controllers/property.controller.ts`: search caching integration

**Run locally**

```bash
docker run -d --name roman-redis -p 6379:6379 redis:alpine
docker exec -it roman-redis redis-cli ping   # expected: PONG
```

```env
REDIS_URL=redis://127.0.0.1:6379
```

---

## 🔌 Real-Time Communication (Socket.IO)

Socket.IO is being integrated to add real-time messaging alongside the REST API.

- **REST API** handles regular data operations such as loading conversations
- **Socket.IO** handles live events such as sending and receiving messages
- Socket connections are authenticated and tied to the existing auth system
- Planned handling for connection failures, unauthorized connections, duplicate listeners and cleanup on disconnect

---

## 📘 API Documentation & Logging

- **Swagger UI (OpenAPI):** interactive documentation of endpoints, schemas and auth requirements. With the server running locally and Swagger mounted at `/api-docs`, open `http://localhost:5000/api-docs` (adjust to your configured path and port).
- **Morgan:** HTTP request logging (method, URL, status, response time) registered as Express middleware. Sensitive data such as passwords, tokens and cookies is never logged.

---

## 🛡️ Production Hardening

A dedicated hardening pass covered: architecture audit, frontend ↔ backend data-flow audit, API contract audit, error-handling audit, environment and configuration review, security review, MongoDB query and index review, frontend performance review, technical-debt refactoring and production build verification.

**Production Baseline v1.0 includes**

- Centralized API request handling and automatic token refresh
- Strongly typed property update flow and backend request validation
- Ownership-based and role-based authorization
- Centralized error handling and environment-based configuration
- Protected refresh-token cookies
- MongoDB query and index baseline, pagination and result limits
- Lazy loading and responsive image optimization (`next/image`, `priority` for above-the-fold images, `sizes`, WebP)
- Verified production builds for client and server

Deployment configuration, expanded automated tests, monitoring and ongoing security reviews are the next steps toward full production readiness.

---

## 🔄 Development Approach

Every feature is built as a complete vertical slice:

```text
UI → API → Database → Integration → Validation → Auth → Testing → Refactoring → Commit
```

The aim is to understand why an architecture works, what can fail, and how failures are handled, not only to make features work.

---

## 🗺️ Roadmap

- [x] Authentication, profiles, property CRUD, search, favorites, agents, agencies
- [x] Admin RBAC, Swagger documentation, Morgan logging
- [x] Redis caching, server unit tests, Production Baseline v1.0
- [ ] Production deployment
- [ ] Expanded automated testing (integration and end-to-end)
- [ ] Real-time messaging and notifications (Socket.IO)
- [ ] Monitoring and observability, further performance and security improvements

---

## 👨‍💻 Author

**Roman Okhremov**: Frontend Developer (React / Next.js / TypeScript) with full-stack experience

- **GitHub:** https://github.com/RomanFrontEndDeveloper/
- **LinkedIn:** https://www.linkedin.com/in/roman-okhremov-9b0764369/
- **Portfolio:** https://portfolio-react-roman-okhremov.netlify.app/
