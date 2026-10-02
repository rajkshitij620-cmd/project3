# Snip — Salon Booking & Grooming Platform (MERN Stack)

**Snip** is a salon booking web application built with the **MERN stack** (MongoDB, Express, React, Node.js) and styled with **Tailwind CSS**.

---

## 🌟 Key Features

### 👤 Customer Experience
- **Geolocation Discovery**: Automatically detect user location or switch between neighborhood presets (e.g., Mission District, Marina, Financial District) to discover nearby studios ranked by distance and ratings.
- **Visual Home Feed**: Explore salon cards displaying authentic hairstyle gallery previews, active barbers working now (`3 barbers active`), seat capacity, price tiers, and reviews.
- **Interactive Map View**: Toggle between Grid and OpenStreetMap/Leaflet interactive pins.
- **Hairstyle Inspiration Gallery**: Browse haircuts, beard sculpts, and balayage styles across salons with category filtering (Men, Women, Beard, Kids).
- **Seat-Capacity-Aware Booking Engine**: Multi-service selection with dynamic duration and price calculation, real-time chair availability calculation (`"2 of 3 chairs open"`), and assigned seat confirmation.
- **Customer Dashboard**: Track upcoming appointments with countdowns, reschedule or cancel anytime (instantly releasing seats), and leave verified 1-5 star reviews after completed appointments.

### ✂️ Barber / Salon Owner Console
- **Salon Studio Profile**: Edit salon name, tagline, description, address, photos, and `totalSeats` (physical chairs).
- **Live Chair Capacity**: Set the number of physical chairs (`totalSeats`), dynamically preventing overlapping double-bookings.
- **Appointment Management**: Accept/Confirm (`confirmed`), Complete (`completed`), or Decline (`cancelled`) bookings.
- **Staff Roster Management**: Add barbers, set specialties, and toggle active working status (`isActive`) which updates the customer-facing "X barbers available" indicator.
- **Hairstyle Portfolio Manager**: Upload style photos with titles and categories (Men, Women, Beard, Kids) with owner-isolated write permissions.
- **Verified Review Engine**: Automatic recalculation of salon `avgRating` and `numReviews` on review submission.

---

## 🚀 1-Click Demo Accounts

Snip comes with pre-seeded demo accounts and realistic sample salons:

| Role | Name | Email | Password |
|---|---|---|---|
| **Customer** | Alex Rivera | `alex@customer.com` | `password123` |
| **Salon Owner** | Marcus Vance (Apothecary Lounge) | `marcus@snip.app` | `password123` |
| **Studio Owner** | Elena Rostova (Atelier Luminance) | `elena@snip.app` | `password123` |

> *Tip: You can also use the **"Demo Switcher"** button in the header navbar to switch roles in 1 click without typing credentials.*

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 (Vite), React Router v6, Tailwind CSS, Lucide React, Leaflet & React-Leaflet, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose (with embedded `mongodb-memory-server` auto-fallback + seeder) |
| **Auth** | JWT (JSON Web Tokens), bcryptjs password hashing, role guards (`customer` / `barber`) |

---

## 🏃 Quick Start Guide (Single Command)

### 1. Install all dependencies (Root, Backend & Frontend)
```bash
npm run install:all
```
*(or run `npm install` in root, backend, and frontend)*

### 2. Run both Backend & Frontend together with 1 Command:
```bash
npm run dev
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5001/api](http://localhost:5001/api)
- **Database:** Auto-initializes embedded in-memory MongoDB and seeds demo data automatically. No manual MongoDB setup required!

---

## 📡 Key API Endpoints

### Auth
- `POST /api/auth/register` — Register a customer or barber
- `POST /api/auth/login` — Sign in
- `POST /api/auth/demo-login` — Instant demo switcher
- `GET /api/auth/me` — Current user profile

### Salons & Hairstyle Gallery
- `GET /api/salons/home-feed?lat=&lng=` — Home feed with gallery previews & blended score
- `GET /api/salons?search=&category=&sort=` — Filtered salon search
- `GET /api/salons/:id` — Full salon detail with staff, gallery, and reviews
- `GET /api/salons/gallery/all?category=` — Global hairstyle portfolio
- `POST /api/salons/:id/services` — Add service (Barber)
- `POST /api/salons/:id/staff` — Add staff barber (Barber)
- `PUT /api/salons/:id/staff/:staffId` — Toggle active status (Barber)
- `POST /api/salons/:id/gallery` — Upload hairstyle (Barber)

### Booking & Capacity Engine
- `GET /api/salons/:id/availability?date=YYYY-MM-DD&duration=30` — Seat capacity availability
- `POST /api/bookings` — Create appointment with atomic seat allocation
- `GET /api/bookings/my` — Customer appointments
- `GET /api/bookings/salon/:salonId` — Barber salon appointments
- `PUT /api/bookings/:id/status` — Confirm / complete / cancel appointment

### Reviews
- `POST /api/reviews` — Verified review tied to completed appointment (auto-updates salon `avgRating`)
- `GET /api/salons/:id/reviews` — Salon review history
# project3
