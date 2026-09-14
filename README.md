🏠 Roman Real Estate 2

Full Stack real estate platform built from scratch as a practical learning and portfolio project.

The project is developed using a Monorepo + Feature-First Architecture and follows a vertical feature development approach:

Frontend → Backend → Database → Integration → Validation → Security → Testing → Refactoring → Commit

🎯 Project Goal

Roman Real Estate 2 is a practical Full Stack application designed to simulate a real-world real estate platform.

The main goal is to understand how a modern Full Stack application is designed, developed, connected, tested and maintained.

The project focuses on:

Product architecture

Frontend development

Backend development

REST API design

Database architecture

Authentication and authorization

Email verification

Password recovery

File uploads

Cloud storage

Validation

Security

API integration

Search and filtering

Pagination

Code organization

Refactoring

Testing

Git workflow

The learning path is designed to progress from:

Junior → Junior+ → Strong Junior → Production-Oriented Full Stack Developer

🏗️ Architecture

Roman Real Estate 2 uses a Monorepo + Feature-First Architecture.

The repository contains separate applications for the frontend and backend.

roman-real-estate-2/
│
├── apps/
│ ├── client/
│ │ ├── app/
│ │ ├── components/
│ │ │ ├── auth/
│ │ │ ├── layout/
│ │ │ ├── profile/
│ │ │ ├── property/
│ │ │ ├── sections/
│ │ │ └── ui/
│ │ ├── lib/
│ │ ├── public/
│ │ └── ...
│ │
│ └── server/
│ ├── src/
│ │ ├── config/
│ │ ├── features/
│ │ │ ├── auth/
│ │ │ ├── profile/
│ │ │ └── property/
│ │ ├── app.ts
│ │ └── server.ts
│ └── ...
│
├── packages/
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
└── README.md

🧩 Feature-First Architecture

The backend is organized around business features rather than one global collection of technical layers.

Current features:

apps/server/src/features/

├── auth/
│ ├── controllers/
│ ├── dto/
│ ├── middleware/
│ ├── models/
│ ├── repository/
│ ├── routes/
│ ├── services/
│ ├── types/
│ └── utils/
│
├── profile/
│ ├── controllers/
│ ├── dto/
│ ├── middleware/
│ ├── repository/
│ ├── routes/
│ ├── services/
│ └── utils/
│
└── property/
├── controllers/
├── dto/
├── middleware/
├── models/
├── repository/
├── routes/
├── services/
└── utils/

Each feature contains the code responsible for its own domain.

Future domains can be added as independent features:

features/

├── auth/
├── profile/
├── property/
├── agents/
├── agencies/
├── favorites/
├── messages/
├── notifications/
└── ...

🔄 Feature Development Workflow

Every major feature is developed as a complete vertical slice.

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

The goal is to finish and understand the complete flow of a feature before moving to the next domain.

🛠️ Tech Stack

Frontend

Next.js 16.3.3

React 19

TypeScript

Tailwind CSS

React Hook Form

Zod

Next/Image

Backend

Node.js

Express

TypeScript

MongoDB

Mongoose

JWT

bcryptjs

Nodemailer

Multer

Cloudinary

Development

pnpm

pnpm Workspace

Git

ESLint

Prettier

Concurrently

tsx

📦 Monorepo

The project uses pnpm Workspace to manage the monorepo.

Client

apps/client

Responsible for:

pages

layouts

UI

forms

client-side authentication state

API communication

user interaction

property search and filtering

Server

apps/server

Responsible for:

REST API

authentication

business logic

database communication

validation

security

file uploads

Cloudinary integration

email delivery

property search

filtering

sorting

pagination

🚀 Getting Started

1. Install dependencies

pnpm install

2. Start development environment

pnpm dev

Frontend:

http://localhost:3000

Backend:

http://localhost:5000

MongoDB must be configured through the project's environment variables.

📜 Available Scripts

Development

pnpm dev
pnpm dev:client
pnpm dev:server

Production Build

pnpm build
pnpm build:client
pnpm build:server

Production

pnpm start:client
pnpm start:server

Lint

pnpm lint

🌐 Public Website

The public website foundation has been implemented.

Completed functionality:

Global Layout

Header

Navigation

Responsive Layout

Design System

Shared UI Components

Landing Page

Hero Section

Property Search UI

Property Categories

Property Cards

Public Property Details

Footer

Refactoring

Some landing-page sections remain available for future expansion.

🔐 Authentication

The authentication system has been implemented end-to-end.

Completed functionality:

User Model

Registration UI

Registration API

Registration Integration

Login UI

Login API

Login Integration

Password Hashing

JWT Access Token

Refresh Token

HttpOnly Refresh Token Cookie

Authentication Middleware

Protected Routes

Current User

Logout

Authentication Errors

Validation

Email Verification

Verification Token Hashing

Verification Token Expiration

Verification Email

Forgot Password

Password Reset Email

Reset Password

Reset Token Hashing

Reset Token Expiration

Automatic Access Token Refresh

Centralized API Fetch

Refresh Request Deduplication

Complete Authentication Flow

Authentication Testing

Refactoring

✉️ Email Verification

New accounts must verify their email address before they can log in.

Registration
↓
User Created
↓
Verification Token Generated
↓
SHA-256 Token Hash Stored in MongoDB
↓
Verification Email Sent
↓
User Clicks Verification Link
↓
/verify-email?token=...
↓
Backend Validates Token
↓
Email Verified
↓
User Can Login

Verification tokens:

Are cryptographically generated

Are stored in MongoDB as SHA-256 hashes

Expire after 1 hour

Are removed after successful verification

🔑 JWT Authentication Flow

The application uses two types of tokens.

Access Token

The access token is short-lived and is used to authenticate API requests.

The frontend stores the access token in:

sessionStorage

Refresh Token

The refresh token is long-lived and is stored in an:

HttpOnly Cookie

The refresh token cannot be accessed directly from JavaScript.

♻️ Automatic Token Refresh

Authenticated API requests are handled through a centralized apiFetch helper.

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

A shared refresh promise prevents multiple simultaneous API requests from creating multiple refresh requests.

🔐 Forgot Password & Reset Password

The password recovery system has been implemented end-to-end.

Login
↓
Forgot password?
↓
/forgot-password
↓
User enters email
↓
POST /api/auth/forgot-password
↓
Reset Token Generated
↓
SHA-256 Token Hash Stored in MongoDB
↓
Reset Email Sent
↓
User Clicks Reset Link
↓
/reset-password?token=...
↓
User Enters New Password
↓
POST /api/auth/reset-password
↓
Token Validated
↓
New Password Hashed with bcryptjs
↓
Password Updated
↓
Reset Token Removed
↓
User Returns to Login

Security considerations:

Reset tokens are cryptographically generated

Only the token hash is stored in MongoDB

Reset tokens expire after 1 hour

Reset tokens are removed after successful password reset

Passwords are hashed with bcryptjs

Forgot-password responses do not reveal whether an email exists

Password confirmation is validated on the frontend

Password validation is enforced by the backend

👤 User Profile

The User Profile feature has been implemented as a complete feature block.

Completed functionality:

Profile Model Extension

Profile Page

Current User Data

Edit Profile

Profile Validation

Avatar Upload

Multer

Cloudinary

Avatar Update

User Preferences

Account Settings

Change Email

Change Password

Password Confirmation Validation

Profile Security

Protected Profile Requests

Complete Profile Flow

Profile Testing

Refactoring

🖼️ Avatar Upload

The avatar upload flow connects the frontend, backend, Cloudinary and MongoDB.

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

The frontend uses Next.js Image for displaying uploaded avatars.

🏠 Property Domain

The Property feature has been implemented as a complete feature block.

Completed functionality:

Property Model

Property Types

Property Status

Property Address / Location

Property Characteristics

Property Pricing

Property Images Structure

Create Property UI

Create Property API

Create Property Integration

Property List UI

Property List API

Property Cards

Property Details Page

Property Details API

Property Gallery

Property Description

Property Features

Property Location

Edit Property

Delete Property

Property Ownership

Property Authorization

Public Property Details

Owner Property Details

Property Search Architecture

Search Input

Debounced Search

Price Filters

Area Filters

Kitchen Area Filters

Bedrooms Filter

Property Type Filter

Sale / Rent Filter

Location Filter

Advanced Filters

Sorting

URL Query Parameters

Backend Filtering

Backend Pagination

Frontend Pagination

Search Performance Optimization

Search + Filters Integration

Testing

Refactoring

🔎 Property Search & Filters

The public property search supports:

Location

Property Type

Sale / Rent

Minimum Price

Maximum Price

Minimum Area

Maximum Area

Minimum Kitchen Area

Maximum Kitchen Area

Bedrooms

Sorting

Sorting options:

Price: Low to High

Price: High to Low

Area: Small to Large

Area: Large to Small

Newest

Search parameters are preserved in the URL.

Example:

/?location=Kyiv&listingType=sale&page=2

This allows filters, sorting and pagination to work together.

📄 Property Pagination

The property API supports server-side pagination.

The response contains:

page
limit
total
totalPages

The frontend provides:

Previous

Page numbers

Next

Pagination preserves the active search filters and sorting parameters.

The default page size is 6 properties, with a backend maximum of 50 properties per request.

⚡ Search Performance

Search performance has been improved with MongoDB indexes for frequently queried and sorted fields.

Current indexes include:

listingType + propertyType + price
listingType + area
bedrooms
createdAt

Property list queries also use Mongoose .lean() because the returned documents are read-only data for the public listing.

🧩 Shared UI Components

The client contains reusable UI components to avoid unnecessary duplication.

Current shared components include:

Button

Input

Card

Layout components include:

Header

Footer

Feature-specific components include:

LoginForm

RegisterForm

ProfileCard

EditProfileForm

AccountSettings

PropertySearch

PropertyCard

PropertyCardAll

PropertyDetails

PropertyDetailsAll

🔒 Security

Security is treated as part of each feature rather than as a separate final step.

Current security-related implementation includes:

Password hashing

JWT authentication

Access and refresh token separation

HttpOnly refresh-token cookies

Authentication middleware

Protected routes

Request validation

Authentication error handling

Token expiration

Email verification

Verification token hashing

Password reset token hashing

Password reset token expiration

Automatic token refresh

Refresh request deduplication

Property ownership checks

Property authorization

Security will continue to be improved as new features are added.

🧪 Testing & Quality

Each completed feature is manually tested end-to-end during development.

Current testing includes:

API testing

Authentication testing

Email verification testing

Forgot-password testing

Password reset testing

Protected route testing

Form validation testing

Password confirmation testing

Token expiration testing

Refresh token testing

Property CRUD testing

Property ownership testing

Property authorization testing

Search testing

Filter testing

Sorting testing

Pagination testing

Search + filters integration testing

Frontend ↔ Backend integration testing

Refactoring

Linting

Production builds

The project currently passes the production build for both client and server:

pnpm build

🔧 Refactoring Philosophy

Refactoring is considered a normal part of development.

The goal is not simply to make a feature work, but to improve:

Code readability

Separation of responsibilities

Reusability

Maintainability

Type safety

Architecture

Error handling

API consistency

Repeated authenticated fetch logic was centralized into:

apps/client/lib/apiFetch.ts

This allows authentication-related behavior to be handled consistently across the application.

📈 Current Project Stage

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
Property Search & Filters
↓
Agents & Agencies
↓
Favorites
↓
Messaging
↓
Notifications
↓
Administration
↓
Testing & Production

Current completed foundation

Product Foundation + Public Website + Authentication + User Profile + Property Domain + Search & Filters

The Property domain and its complete search/filter/pagination flow are now implemented and tested.

🚧 Upcoming Features

Agents

Agent Profiles

Agent Listings

Agent Search

Agent Details

Agencies

Agency Model

Agency Profiles

Agency Properties

Agency Management

Favorites

Add Property to Favorites

Remove Property from Favorites

Favorites Page

Favorite State

Messaging

Conversations

Messages

Real-time Communication

Socket.io

Notifications

In-App Notifications

Email Notifications

Real-Time Notifications

Administration

Admin Dashboard

User Management

Property Management

Role-Based Access Control

Moderation

Production

Automated Testing

API Documentation

Swagger

Security Hardening

Performance Optimization

Error Monitoring

Production Deployment

📚 Learning Path

The project is designed around progressive Full Stack development:

Junior
↓
Junior+
↓
Strong Junior
↓
Production-Oriented Full Stack Developer

The emphasis is on understanding the complete lifecycle of a feature:

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

👨‍💻 Author

Roman Okhremov

Roman Real Estate 2 — Full Stack Learning & Portfolio Project.

CV:

ROMAN OKHREMOV
Frontend Developer (React / Next.js / TypeScript)
with Full-Stack Experience

Khmelnytskyi, Ukraine
Email: romariotraveler@gmail.com
GitHub: https://github.com/RomanFrontEndDeveloper/
LinkedIn: https://www.linkedin.com/in/roman-okhremov-9b0764369/?locale=uk
Portfolio: https://portfolio-react-roman-okhremov.netlify.app/

PROFESSIONAL SUMMARY

Frontend Developer specializing in React, Next.js, and TypeScript, with Full-Stack experience building modern, responsive web applications. Experienced in REST API integration, authentication and authorization, reusable component architecture, form validation, and third-party integrations.

Hands-on experience with Next.js App Router, React, TypeScript, Tailwind CSS, Node.js, Express.js, MongoDB, and Mongoose. Built applications with JWT authentication, access/refresh tokens, HttpOnly cookies, email verification, password recovery, protected routes, CRUD operations, Cloudinary image uploads, advanced search, filtering, sorting, and pagination.

Focused on clean, maintainable code, feature-first architecture, performance optimization, testing, and continuous development.

TECHNICAL SKILLS

Frontend: React, Next.js, JavaScript (ES6+), TypeScript, HTML5, CSS3, SCSS, Tailwind CSS, Framer Motion, React Hook Form, Zod, TanStack Query, Axios, Next/Image

Backend: Node.js, Express.js, REST API, MongoDB, Mongoose, JWT, bcryptjs, Multer

Architecture: Feature-First Architecture, Monorepo, pnpm Workspace, REST API Integration, CRUD, Authentication & Authorization

State Management: Redux Toolkit, Context API

Cloud & Integrations: Cloudinary, SalesDrive CRM API, Telegram Bot API

Tools: Git, GitHub, VS Code, Postman, Figma, Vercel, Render, pnpm, ESLint, Prettier

PROJECTS
Roman Real Estate 2 — Full-Stack Real Estate Platform

Next.js 16.3.3, React 19, TypeScript, Tailwind CSS, Node.js, Express.js, MongoDB, Mongoose, JWT, Cloudinary, Multer, Zod

Built a full-stack real estate platform using Monorepo + Feature-First Architecture.
Implemented JWT authentication with access/refresh tokens, HttpOnly cookies, automatic token refresh, email verification, and password recovery.
Developed complete property CRUD with protected routes, ownership checks, and authorization.
Implemented Cloudinary image uploads and property image management.
Built advanced property search with location, price, area, kitchen area, bedrooms, property type, and sale/rent filters.
Implemented URL-based search parameters, sorting, and server-side/frontend pagination.
Optimized property search using MongoDB indexes and Mongoose .lean().
Tested frontend/backend integration and production builds.

GitHub: https://github.com/RomanFrontEndDeveloper/

Roman Real Estate — Full-Stack Real Estate Platform

Next.js, React, TypeScript, Express.js, MongoDB, JWT, Cloudinary

Built a full-stack real estate application with authentication and authorization.
Implemented property CRUD operations and protected REST API routes.
Integrated MongoDB/Mongoose and Cloudinary for image storage.
Developed responsive UI with React, Tailwind CSS, and reusable components.

GitHub: https://github.com/RomanFrontEndDeveloper/roman-real-estate
Vercel: https://roman-real-estate.vercel.app/

Lead Integration App — CRM Integration Platform

Next.js, TypeScript, SalesDrive CRM API, Telegram Bot API

Built a lead collection system with custom form validation and anti-spam protection.
Integrated SalesDrive CRM API for lead processing.
Implemented Telegram Bot API integration for lead monitoring.
Developed secure server-side API handling with Next.js.

GitHub: https://github.com/RomanFrontEndDeveloper/lead-integration

Job Tracker App — Full-Stack Application

Next.js, Express.js, MongoDB, JWT

Built a full-stack job tracking application with JWT authentication.
Developed Express.js REST API and MongoDB integration.
Implemented protected routes and CRUD functionality.

GitHub: https://github.com/RomanFrontEndDeveloper/job-tracker-app
Vercel: https://job-tracker-app-5evc.vercel.app/

EXPERIENCE
Frontend / Full-Stack Developer
Independent Project Developer — Personal Projects

2023 — Present

Develop full-stack web applications using React, Next.js, TypeScript, Node.js, and Express.js.
Build responsive interfaces using reusable React components and Tailwind CSS.
Design and integrate REST APIs with MongoDB and Mongoose.
Implement authentication, authorization, JWT access/refresh tokens, and protected routes.
Develop CRUD functionality, form validation, search, filtering, sorting, and pagination.
Integrate third-party services including Cloudinary, SalesDrive CRM, and Telegram Bot API.
Work with feature-based architecture, Git/GitHub, debugging, testing, refactoring, and application optimization.
EDUCATION
Khmelnytskyi National University

Engineering Degree
2008 — 2013

LANGUAGES

Ukrainian — Native
English — B1
Polish — B1
