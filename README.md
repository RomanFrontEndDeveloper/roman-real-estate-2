🏠 Roman Real Estate 2

Full Stack real estate platform built from scratch as a practical
learning and portfolio project.

The project is developed using a Monorepo + Feature-First
Architecture and follows a vertical feature development approach:

Frontend → Backend → Database → Integration → Validation → Security →
Testing → Refactoring → Commit

🎯 Project Goal

Roman Real Estate 2 is a practical Full Stack application designed to
simulate a real-world real estate platform.

The main goal of the project is to understand how a modern Full Stack
application is designed, developed, connected and maintained.

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

Code organization

Refactoring

Testing

Git workflow

The learning path is designed to progress from:

Junior → Junior+ → Strong Junior

🏗️ Architecture

Roman Real Estate 2 uses a Monorepo + Feature-First Architecture.

The repository contains separate applications for the frontend and
backend.

roman-real-estate-2/

├── apps/
│ ├── client/
│ │ ├── app/
│ │ ├── components/
│ │ │ ├── auth/
│ │ │ ├── layout/
│ │ │ ├── profile/
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
│ │ │ └── profile/
│ │ ├── app.ts
│ │ └── server.ts
│ └── ...
├── packages/
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
└── README.md

🧩 Feature-First Architecture

The backend is organized around business features, not around one
global collection of technical layers.

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
└── profile/
├── controllers/
├── dto/
├── middleware/
├── repository/
├── routes/
├── services/
└── utils/

Each feature contains the code responsible for its own domain.

Future domains can be added as independent features:

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

The goal is to finish and understand the complete flow of a feature
before moving to the next domain.

🛠️ Tech Stack

Frontend

Next.js 16

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

Responsible for pages, layouts, UI, forms, client-side authentication
state, API communication and user interaction.

Server

apps/server

Responsible for the REST API, authentication, business logic, database
communication, validation, security, file uploads, Cloudinary
integration and email delivery.

🚀 Getting Started

1. Install dependencies

pnpm install

2. Start development environment

pnpm dev

Frontend:

http://localhost:3000

Backend:

http://localhost:5000

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

Featured Properties

Property Categories

Popular Locations

Agents Section

CTA Sections

Footer

Public Website Review

Refactoring

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

The access token is short-lived and is used to authenticate API
requests.

The frontend stores the access token in:

sessionStorage

Refresh Token

The refresh token is long-lived and is stored in an:

HttpOnly Cookie

The refresh token cannot be accessed directly from JavaScript.

♻️ Automatic Token Refresh

Authenticated API requests are handled through a centralized apiFetch
helper.

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

A shared refresh promise prevents multiple simultaneous API requests
from creating multiple refresh requests.

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

The User Profile feature has been implemented as a complete feature
block.

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

The avatar upload flow connects the frontend, backend, Cloudinary and
MongoDB.

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

🧩 Shared UI Components

The client contains reusable UI components to avoid unnecessary
duplication.

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

🏠 Current Project Stage

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

The current completed foundation consists of:

Product Foundation + Public Website + Authentication + User Profile

The next major domain is the Property feature.

🚧 Upcoming Features

Property Domain

Property Model

Property CRUD

Property Validation

Property Images

Property Details

Property Search

Search Filters

Property Categories

Locations

Property Ownership

Property Status

Favorites

Add Property to Favorites

Remove Property from Favorites

Favorites Page

Favorite State

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

🔒 Security

Security is treated as part of each feature rather than as a separate
final step.

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

Security will continue to be improved as new features are added.

🧪 Testing & Quality

Each completed feature is manually tested end-to-end during development.

The development process includes:

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

Frontend ↔ Backend integration testing

Refactoring

Linting

Production builds

The project is continuously refactored as the architecture evolves.

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

This allows authentication-related behavior to be handled consistently
across the application.

📈 Learning Path

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

Roman Real Estate 2 --- Full Stack Learning & Portfolio Project.
