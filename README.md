# Doorstep — MERN Real Estate Marketplace

![image](public\brand\doorstep-mark-512.png)


React (Vite) + Tailwind client, Express + MongoDB (Mongoose) API, JWT auth, Cloudinary uploads, Leaflet maps.

## Structure
```
server/   Express API (models, controllers, routes, middleware, seed)
client/   React app (pages, components, hooks, context)
```

## Setup
1. **Prerequisites:** Node 18+, a running MongoDB (local or Atlas), optional Cloudinary account (needed only for image uploads).
2. **Env files**
   ```bash
   cp server/.env.example server/.env   # set MONGO_URI, JWT_SECRET, Cloudinary keys
   cp client/.env.example client/.env
   ```
3. **Install** (from the project root)
   ```bash
   npm run install:all
   ```
4. **Seed demo data** (optional, wipes users/properties/inquiries)
   ```bash
   npm run seed
   ```
5. **Run client and server together**
   ```bash
   npm run dev
   ```
   - Client: http://localhost:5173
   - API: http://localhost:5000/api/health

Run them separately with `npm run dev --prefix server` and `npm run dev --prefix client`.

## Demo accounts (after seeding, password `password123`)
| Role  | Email |
|-------|-------|
| Admin | admin@doorstep.dev |
| Agents | sarah@doorstep.dev, marcus@doorstep.dev, elena@doorstep.dev, david@doorstep.dev |
| Users | buyer@doorstep.dev, jamie@doorstep.dev, priya@doorstep.dev |

## API overview
| Area | Endpoints |
|------|-----------|
| Auth | `POST /auth/register`, `/auth/login`, `/auth/logout`, `GET /auth/me` |
| Properties | `GET /properties` (filters: city, minPrice, maxPrice, beds, baths, propertyType, listingType, amenities, lat/lng/radius, search, page, limit, sort), `GET /properties/:id`, `GET /properties/agent/:agentId`, `POST/PUT/DELETE` (agent/admin) |
| Inquiries | `POST /inquiries`, `GET /inquiries` (agent/admin), `GET /inquiries/sent`, `PUT /inquiries/:id/status` |
| Users | `GET/PUT/DELETE /users/:id`, `GET /users/favorites/me`, `POST /users/favorites/:propertyId` |
| Admin | `GET /admin/stats`, `/admin/users`, `/admin/listings`, `PUT /admin/users/:id/role` |

## Notes
- Auth uses an HTTP-only cookie; the API also accepts a `Bearer` token. In production set `NODE_ENV=production`, serve over HTTPS and set `CLIENT_URL` to your deployed client origin.
- Creating a listing with photos requires Cloudinary credentials. Without them, seeded listings use Unsplash image URLs.
- The default map tiles use the public OpenStreetMap server, which is fine for development; use a tile provider (or Mapbox) for production traffic.
- Virtual tours take any embeddable URL (Matterport, Kuula, a hosted Pannellum page).
- Not included yet: email/socket notifications for new viewing requests (hook point marked in `inquiry.controller.js`), agent reviews, rate limiting and input validation middleware (recommended before launch).
