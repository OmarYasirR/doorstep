![applogo](client/public/brand/doorstep-mark-512.png)

<p align="center">
  <strong>A full-stack real estate marketplace: search on a map, tour homes in 3D, and book viewings with local agents.</strong>
</p>

<p align="center">
  React · Vite · Tailwind CSS · Node.js · Express · MongoDB · JWT · Leaflet
</p>

---

## Table of contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech stack](#tech-stack)
4. [Project structure](#project-structure)
5. [Getting started](#getting-started)
6. [Configuration](#configuration)
7. [Demo data and accounts](#demo-data-and-accounts)
8. [Roles and permissions](#roles-and-permissions)
9. [API reference](#api-reference)
10. [Data model](#data-model)
11. [Frontend routes](#frontend-routes)
12. [Deployment notes](#deployment-notes)
13. [Troubleshooting](#troubleshooting)
14. [Known limitations and roadmap](#known-limitations-and-roadmap)

## Overview

Doorstep connects home seekers with agents. Visitors search listings with filters that stay in sync with an interactive map, explore photo galleries and virtual tours, and send viewing requests. Agents publish and manage listings and respond to requests. Admins oversee the whole platform from a metrics dashboard.

The repository is a monorepo with two independent apps: an Express REST API (`server/`) and a React single-page client (`client/`).

## Features

**For home seekers**
- Multi-filter search: city, price range, beds, baths, property type, buy or rent, and amenities
- Split list and map view with synced hover and selection, plus "Search this area" for map-based queries
- Property pages with a photo gallery, specs, amenities, location map and an embedded 3D virtual tour
- Save favorite homes to a personal list
- Book a viewing with a date and time slot, or send the agent a message

**For agents**
- Create, edit and delete listings with multi-photo upload (Cloudinary)
- Manage listing status: available, pending, sold or rented
- Inbox for viewing requests and messages, with confirm, decline and complete actions
- Public agent profile with bio, rating and active listings

**For admins**
- Platform metrics: total listings, new listings, active users, sold or rented count
- Listing trends over the last six months and listings by city
- User management, including changing roles

**Platform**
- JWT authentication with HTTP-only cookies (Bearer tokens also accepted) and bcrypt password hashing
- Role-based authorization (`user`, `agent`, `admin`)
- Slot-conflict check so two pending or confirmed viewings can't share a property, date and time
- Responsive layout with accessible controls and reduced-motion support

## Tech stack

| Layer | Technology |
|-------|------------|
| Client | React 18, Vite, React Router, Tailwind CSS, Framer Motion, Lucide icons, Axios |
| Maps | Leaflet with React Leaflet (OpenStreetMap tiles) |
| API | Node.js, Express |
| Database | MongoDB with Mongoose (2dsphere geospatial and text indexes) |
| Auth | JSON Web Tokens, bcrypt |
| Media | Cloudinary via Multer |

## Project structure

```
.
├── package.json              # Root scripts: install:all, dev, seed
├── server/
│   ├── server.js             # App entry point
│   ├── config/               # Database and Cloudinary setup
│   ├── middleware/           # auth (protect, authorize) and error handling
│   ├── models/               # User, Property, Inquiry
│   ├── controllers/          # Business logic per resource
│   ├── routes/               # Express routers
│   ├── utils/upload.js       # Multer + Cloudinary storage
│   └── seed/seed.js          # Demo data generator
└── client/
    ├── index.html
    ├── public/brand/         # Logo files (SVG, PNG)
    └── src/
        ├── api/              # Configured Axios instance
        ├── context/          # AuthContext
        ├── hooks/            # usePropertySearch (URL-driven search state)
        ├── utils/            # Formatting helpers
        ├── components/
        │   ├── layout/       # Navbar, Footer, Logo, ProtectedRoute
        │   ├── property/     # PropertyCard, ImageGallery, VirtualTour, AgentCard, BookingModal
        │   ├── search/       # FilterBar, ResultsList, MapView
        │   └── dashboard/    # StatCard, ListingsTable, InquiriesTable, ListingForm
        └── pages/            # Home, SearchPage, PropertyDetail, AgentProfile,
                              # Login, Register, Saved, Dashboard, NotFound
```

## Getting started

### Prerequisites

- Node.js 18 or newer
- A MongoDB instance (local install or a MongoDB Atlas cluster)
- A Cloudinary account, only if you want to upload listing photos or avatars

### Installation

```bash
# 1. Create environment files
cp server/.env.example server/.env
cp client/.env.example client/.env

# 2. Edit server/.env: set MONGO_URI and a long random JWT_SECRET

# 3. Install dependencies for the root, server and client
npm run install:all

# 4. (Optional) Load demo data
npm run seed

# 5. Start the API and the client together
npm run dev
```

| Service | URL |
|---------|-----|
| Client | http://localhost:5173 |
| API | http://localhost:5000/api |
| Health check | http://localhost:5000/api/health |

### Available scripts

| Command | Where | Description |
|---------|-------|-------------|
| `npm run install:all` | root | Installs root, server and client dependencies |
| `npm run dev` | root | Runs server and client concurrently |
| `npm run seed` | root | Resets the database and inserts demo data |
| `npm run dev` | `server/` or `client/` | Runs one side only (nodemon or Vite) |
| `npm start` | `server/` | Runs the API without file watching |
| `npm run build` | `client/` | Production build into `client/dist` |

## Configuration

### Server (`server/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGO_URI` | Yes | n/a | MongoDB connection string |
| `JWT_SECRET` | Yes | n/a | Secret used to sign tokens. Use a long random value |
| `JWT_EXPIRES_IN` | No | `7d` | Token lifetime |
| `PORT` | No | `5000` | API port |
| `CLIENT_URL` | No | `http://localhost:5173` | Allowed CORS origin for the client |
| `NODE_ENV` | No | `development` | Set to `production` to enable secure cookies |
| `CLOUDINARY_CLOUD_NAME` | For uploads | n/a | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | For uploads | n/a | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | For uploads | n/a | Cloudinary API secret |

### Client (`client/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:5000/api` | Base URL of the API |

## Demo data and accounts

`npm run seed` **deletes all users, properties and inquiries**, then creates:

- 8 users (1 admin, 4 agents, 3 buyers)
- 30 listings across Austin, Dallas, Houston, Denver and Seattle, in mixed types and statuses
- About 24 inquiries and viewing requests in every status
- Saved homes for two of the buyers

The seed is deterministic, so repeated runs produce the same data. All demo accounts use the password `password123`.

| Role | Email |
|------|-------|
| Admin | `admin@doorstep.dev` |
| Agent | `sarah@doorstep.dev`, `marcus@doorstep.dev`, `elena@doorstep.dev`, `david@doorstep.dev` |
| User | `buyer@doorstep.dev`, `jamie@doorstep.dev`, `priya@doorstep.dev` |

> Do not run the seed against a database that holds real data, and change these credentials or remove the accounts before any public deployment.

## Roles and permissions

| Action | Visitor | User | Agent | Admin |
|--------|:------:|:----:|:-----:|:-----:|
| Browse and search listings | ✓ | ✓ | ✓ | ✓ |
| View agent profiles | ✓ | ✓ | ✓ | ✓ |
| Save favorites | | ✓ | ✓ | ✓ |
| Send inquiries and book viewings | | ✓ | ✓ | ✓ |
| Create listings | | | ✓ | ✓ |
| Edit or delete listings | | | Own only | All |
| Manage viewing requests | | | Own only | All |
| View platform stats, manage users and roles | | | | ✓ |

Self-registration only creates `user` or `agent` accounts. Admin accounts can't be created through the public sign-up form.

## API reference

Base path: `/api`. Protected routes need the `token` cookie or an `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Public | Create an account (`username`, `email`, `password`, optional `role`: `user` or `agent`) |
| POST | `/auth/login` | Public | Log in and receive the auth cookie |
| POST | `/auth/logout` | Public | Clear the auth cookie |
| GET | `/auth/me` | Authenticated | Current user |

### Properties

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/properties` | Public | Search listings (query parameters below) |
| GET | `/properties/:id` | Public | Listing details; increments the view counter |
| GET | `/properties/agent/:agentId` | Public | All listings for an agent |
| POST | `/properties` | Agent, Admin | Create a listing (`multipart/form-data`, up to 12 `images`) |
| PUT | `/properties/:id` | Owner agent, Admin | Update a listing; uploaded images are appended |
| DELETE | `/properties/:id` | Owner agent, Admin | Delete a listing |

**Search query parameters:** `city`, `minPrice`, `maxPrice`, `beds` (minimum), `baths` (minimum), `propertyType`, `listingType` (`sale` or `rent`), `amenities` (comma-separated, all must match), `status`, `featured`, `search` (full-text), `lat`, `lng`, `radius` (meters), `page`, `limit` (max 50), `sort` (for example `-createdAt` or `price`).

By default, only `available` and `pending` listings are returned.

### Inquiries

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/inquiries` | Authenticated | Send a message or viewing request. Returns `409` if the slot is taken |
| GET | `/inquiries` | Agent, Admin | Incoming inquiries (agents see their own; admins see all) |
| GET | `/inquiries/sent` | Authenticated | Inquiries the current user has sent |
| PUT | `/inquiries/:id/status` | Owner agent, Admin | Set status: `pending`, `confirmed`, `declined`, `completed`, `cancelled` |

### Users

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/users/:id` | Public | Public profile (used for agent pages) |
| PUT | `/users/:id` | Self, Admin | Update profile; optional `avatar` upload |
| DELETE | `/users/:id` | Self, Admin | Delete an account |
| GET | `/users/favorites/me` | Authenticated | Saved listings |
| POST | `/users/favorites/:propertyId` | Authenticated | Toggle a saved listing |

### Admin

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/admin/stats` | Admin | Totals, six-month trend and listings by city |
| GET | `/admin/users` | Admin | Paginated users, optional `role` filter |
| GET | `/admin/listings` | Admin | Paginated listings, optional `status` filter |
| PUT | `/admin/users/:id/role` | Admin | Change a user's role |

## Data model

**User:** `username`, `email`, `password` (hashed, hidden by default), `role`, `avatar`, `phone`, agent fields (`agencyName`, `bio`, `licenseNumber`, `rating`, `reviewCount`), `favorites[]`, `isActive`.

**Property:** `title`, `description`, `price`, `listingType` (`rent`/`sale`), `propertyType`, `status`, `location` (address fields plus a GeoJSON `Point` in `[lng, lat]` order), `specs` (`beds`, `baths`, `sqft`, `yearBuilt`, `lotSize`), `amenities[]`, `images[]`, `virtualTourUrl`, `agent`, `createdBy`, `views`, `featured`.

**Inquiry:** `property`, `agent`, `user`, `type` (`message`/`viewing_request`), `message`, `requestedDate`, `requestedTimeSlot`, `status`, `contactInfo`.

Indexes include a `2dsphere` index on listing coordinates, a text index on title, description and city, and a compound index for the common price, type and status filters.

## Frontend routes

| Path | Access | Page |
|------|--------|------|
| `/` | Public | Home with search, featured homes and how it works |
| `/search` | Public | Filters, results list and map (state is stored in the URL, so searches are shareable) |
| `/properties/:id` | Public | Listing details, gallery, tour, map and agent card |
| `/agents/:id` | Public | Agent profile and active listings |
| `/login`, `/register` | Public | Authentication |
| `/saved` | Signed in | Saved homes |
| `/dashboard` | Agent, Admin | Listings, requests and, for admins, metrics and users |

## Deployment notes

- Set `NODE_ENV=production`, use HTTPS, and set `CLIENT_URL` to the exact origin of your deployed client. In production the auth cookie is sent with `SameSite=None; Secure`, which is what lets a client and API on different domains share a session.
- Build the client with `npm run build --prefix client` and serve `client/dist` from any static host. Set `VITE_API_URL` at build time to your API's public URL.
- Use a long, random `JWT_SECRET` and keep all `.env` files out of version control (already covered by `.gitignore`).
- The default map tiles come from the public OpenStreetMap servers, which are intended for light, development-level traffic. For production, use a tile provider that suits your volume (for example Mapbox, MapTiler or a self-hosted tile server).
- Photo uploads write to Cloudinary under `doorstep/properties` and `doorstep/avatars`.

## Troubleshooting

| Symptom | Likely cause and fix |
|---------|----------------------|
| Logged in, but the next request says "Not authenticated" | `CLIENT_URL` doesn't match the client's exact origin (including port), or the client and API are on different domains without HTTPS in production |
| Home page shows "No listings yet" | The database is empty. Run `npm run seed` |
| Listing creation fails when uploading photos | Missing or wrong Cloudinary credentials in `server/.env` |
| Map shows grey tiles or is misplaced | Leaflet's stylesheet failed to load. Confirm `client/src/index.css` imports `leaflet/dist/leaflet.css` |
| Server exits right after start | MongoDB isn't reachable. Check `MONGO_URI` and that the database is running |
| A seeded photo doesn't load | The demo listings use Unsplash image URLs. Replace the ID in `PHOTOS` at the top of `server/seed/seed.js` |

## Known limitations and roadmap

Current limitations:
- Agent ratings are stored values; there is no review submission flow yet
- No email or real-time notifications when a viewing request arrives (a hook point is marked in `inquiry.controller.js`)
- No automated tests, request rate limiting or schema-level input validation middleware
- Tokens are a single long-lived JWT with no refresh or revocation flow

Suggested next steps:
- Reviews and ratings for agents
- Email or WebSocket notifications for new requests
- Rate limiting, request validation and automated tests
- Saved searches and price-drop alerts
- A 360° viewer (for example Pannellum) alongside the iframe-based tour

## License

No license has been added yet. Add a `LICENSE` file before sharing or open-sourcing the project.