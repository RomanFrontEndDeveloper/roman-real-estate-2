# 🏠 Roman Real Estate 2

Full-Stack real estate platform built from scratch as a learning and portfolio project.

The application simulates a modern real estate marketplace where users can register, manage their profiles, create and manage property listings, search and filter properties, work with agents and agencies, and save properties to favorites.

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
- Automatic access-token refresh
- Authorization for protected resources

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
- Property ownership
- Ownership-based authorization
- Reusable property cards
- Public property pages
- Personal property pages
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
- Map-based property display

### ❤️ Favorites

- Add property to favorites
- Remove property from favorites
- Favorites page
- Favorite state synchronization
- Favorite controls available only to authenticated users

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

The project avoids unnecessary component duplication by using reusable components with configurable props.

Examples:

- `PropertyCard`
- `PropertyDetails`
- `BackButton`
- `PropertyGallery`
- `PropertyFeatures`
- `DeletePropertyButton`
- `AgencyCard`
- `AgentCard`

Components can change their behavior depending on the page context.

For example, `PropertyDetails` supports different modes:

```tsx
<PropertyDetails property={property} />