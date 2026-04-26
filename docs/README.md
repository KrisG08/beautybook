# LastMinute - Beauty Booking App Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Database Schema](#database-schema)
4. [User Roles & Authentication](#user-roles--authentication)
5. [Application Flow](#application-flow)
6. [API Routes](#api-routes)
7. [Business Dashboard Features](#business-dashboard-features)
8. [Admin Dashboard](#admin-dashboard)
9. [Client Features](#client-features)
10. [Deployment](#deployment)

---

## 1. Project Overview

**LastMinute** is a mobile-first beauty booking platform based in Plovdiv, Bulgaria. It enables clients to discover and book beauty services (haircuts, nails, aesthetic treatments) from local businesses in real-time.

### Core Features
- User authentication with role-based access (Client, Business, Admin)
- Real-time booking system with time slot management
- Business dashboard for managing appointments, services, and schedule
- Admin panel for approving and managing businesses
- Clean, modern UI with yellow (#FFD600) and cream (#FFFDF5) color scheme

### App URLs
- Landing: `/`
- Auth: `/auth`
- Client: `/client`
- Business: `/business` & `/business/dashboard`
- Admin: `/admin`

---

## 2. Technology Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 16 |
| Language | TypeScript |
| Database | SQLite (via Prisma ORM) |
| Authentication | JWT tokens + localStorage |
| UI Library | Lucide React icons |
| Animations | Framer Motion |
| Styling | Tailwind CSS (inline styles) |
| Date Handling | date-fns |

### Key Dependencies
```json
{
  "next": "^16.2.4",
  "prisma": "^5.22.0",
  "@prisma/client": "^5.22.0",
  "framer-motion": "^11.0.0",
  "lucide-react": "^0.400.0",
  "date-fns": "^3.6.0",
  "jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.3"
}
```

---

## 3. Database Schema

### Models

#### User
| Field | Type | Description |
|------|------|-------------|
| id | String (cuid) | Primary key |
| name | String | User's name |
| email | String | Unique email |
| password | String | Bcrypt hashed |
| phone | String? | Optional phone |
| role | String | 'client', 'business', or 'admin' |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update |

#### Business
| Field | Type | Description |
|------|------|-------------|
| id | String (cuid) | Primary key |
| userId | String | Foreign key to User |
| name | String | Business name |
| contactPerson | String | Owner's name |
| phone | String | Contact phone |
| email | String | Business email |
| address | String | Location |
| description | String? | Business description |
| category | String | 'hair', 'nails', or 'aesthetic' |
| imageUrl | String? | Hero image URL |
| status | String | 'pending', 'approved', or 'rejected' |
| commission | Int | Commission percentage (default: 10) |
| rating | Float | Average rating |
| reviewCount | Int | Number of reviews |
| bankAccount | String? | Payment details |
| createdAt | DateTime | Creation timestamp |

#### Service
| Field | Type | Description |
|------|------|-------------|
| id | String (cuid) | Primary key |
| businessId | String | Foreign key to Business |
| name | String | Service name |
| duration | Int | Minutes (default: 30) |
| price | Float | Price in BGN |
| description | String? | Service details |
| active | Boolean | Is service available |
| createdAt | DateTime | Creation timestamp |

#### TimeSlot
| Field | Type | Description |
|------|------|-------------|
| id | String (cuid) | Primary key |
| businessId | String | Foreign key to Business |
| date | String | Date (yyyy-MM-dd) |
| startTime | String | Start time (HH:mm) |
| endTime | String | End time (HH:mm) |
| available | Boolean | Is slot available |

#### Booking
| Field | Type | Description |
|------|------|-------------|
| id | String (cuid) | Primary key |
| userId | String | Foreign key to User |
| businessId | String | Foreign key to Business |
| serviceId | String | Foreign key to Service |
| slotId | String | Foreign key to TimeSlot |
| status | String | 'confirmed', 'completed', 'cancelled' |
| totalPrice | Float | Total price |
| createdAt | DateTime | Creation timestamp |

#### Review
| Field | Type | Description |
|------|------|-------------|
| id | String (cuid) | Primary key |
| userId | String | Foreign key to User |
| businessId | String | Foreign key to Business |
| rating | Int | Star rating (1-5) |
| comment | String? | Review text |
| createdAt | DateTime | Creation timestamp |

---

## 4. User Roles & Authentication

### Roles
| Role | Access | Description |
|------|-------|-------------|
| client | /client | Book services, view bookings |
| business | /business/* | Manage business, view bookings |
| admin | /admin/* | Approve businesses, manage platform |

### Registration Fields by Role
| Role | Required Fields |
|------|-------------|
| client | name, email, password, phone (optional) |
| business | businessName, contactPerson, address, category, email, password |
| admin | email, password + admin code (admin123) |

### Auth Flow
1. User visits `/auth`
2. Chooses role (Client/Business/Admin)
3. Signs up or logs in
4. Token stored in localStorage
5. Redirected to role-based portal

---

## 5. Application Flow

### Client Flow
```
Landing (/ → /auth → Sign Up as Client → /client
                           ↓
              Search businesses → Select service → Choose slot → Confirm → Booking
                           ↓
              View bookings → /client/calendar
```

### Business Flow
```
/auth → Sign Up as Business → /business/apply → Wait for approval
                                    ↓
              Approved → /business → /business/dashboard
                           ↓
              Add services → Add time slots → View bookings
```

### Admin Flow
```
/auth → Sign Up as Admin → /admin
                      ↓
     Approve businesses → View all bookings → Analytics
```

---

## 6. API Routes

### Authentication
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | /api/register | Create new user |
| POST | /api/login | Login user, get JWT |

### User Management
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | /api/user?id= | Get user by ID |
| PATCH | /api/user?userId= | Update user |

### Businesses
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | /api/data/businesses | List all businesses |
| GET | /api/data/businesses?userId= | Get business by user |
| POST | /api/data/businesses | Create business |
| PATCH | /api/data/business?businessId= | Update status |

### Services
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | /api/data/services?businessId= | List services |
| POST | /api/data/services | Create service |
| PATCH | /api/data/services?serviceId= | Update service |
| DELETE | /api/data/services?serviceId= | Delete service |

### Time Slots
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | /api/data/timeSlots?businessId= | List slots |
| POST | /api/data/timeSlots | Create slot |
| DELETE | /api/data/timeSlots?slotId= | Delete slot |

### Bookings
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | /api/data/bookings?businessId= | Get business bookings |
| GET | /api/data/bookings?userId= | Get user bookings |
| POST | /api/data/bookings | Create booking |
| PATCH | /api/data/bookings?bookingId= | Update status |

### Reviews
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | /api/reviews?businessId= | List reviews |
| POST | /api/reviews | Create review |

---

## 7. Business Dashboard Features

The business dashboard (`/business/dashboard`) has 10 main sections accessible via bottom tab navigation:

### 1. Home
- Today's bookings with timeline view
- Quick stats: earnings today, pending bookings, total bookings
- Alert for empty slots

### 2. Calendar
- Daily/weekly date selector
- View available time slots
- Add/delete time slots

### 3. Services
- List all services
- Add new service (name, duration, price, description)
- Edit/delete existing services
- Toggle active/inactive

### 4. Availability
- Weekly working hours display
- Custom rules per day

### 5. Bookings
- All bookings list
- Filter by status (upcoming/past/cancelled)
- Actions: Complete, Cancel

### 6. Alerts
- Real-time booking notifications
- New booking alerts
- Cancellation alerts

### 7. Analytics
- Total bookings count
- Total revenue
- Most popular services

### 8. Profile
- Business name, category, address, description editing

### 9. Settings
- Sign out

### Quick Actions
- Complete/Cancel buttons on each booking
- Add time slot modal
- Add service modal

---

## 8. Admin Dashboard

Access: `/admin`

### Features
- **Businesses**: View/approve/reject business applications
- **Pending**: Businesses waiting for approval
- **Users**: View all registered users
- **Bookings**: View all platform bookings

### Stats
- Total businesses
- Total users
- Total bookings

---

## 9. Client Features

Access: `/client`

### Features
- **Discover**: Browse approved businesses by category
- **Search**: Filter businesses by service type
- **Location**: View business details, services, time slots
- **Book**: Select service → Choose slot → Confirm
- **Calendar**: View personal bookings
- **Account**: Profile management

### Categories
- Hair & Barber (icon: Scissors)
- Nails (icon: Heart)
- Aesthetic (icon: Sparkles)

---

## 10. Deployment

### Development Setup
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Database
- SQLite database: `dev.db`
- Location: Project root
- Managed via Prisma CLI

### Environment Variables
```env
DATABASE_URL="file:./dev.db"
```

---

## Design System

### Colors
| Name | Hex | Usage |
|------|-----|-------|
| primary | #FFD600 | CTAs, highlights |
| surface | #FFF7E0 | Card backgrounds |
| background | #FFFDF5 | Page background |
| textPrimary | #2A241C | Main text |
| textSecondary | #6B6358 | Secondary text |
| textMuted | #9A9595 | Placeholder text |
| border | #E8DDC7 | Borders |
| success | #059669 | Success states |
| error | #DC2626 | Error states |
| warning | #D97706 | Warning states |

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: DM Sans (sans-serif)

### UI Components
- Bottom navigation for mobile
- Card-based layouts with rounded-2xl corners (24px)
- Yellow gradient image overlays
- Large tap targets (min 44px)

---

## Troubleshooting

### Common Issues
1. **Hydration Error**: Use `suppressHydrationWarning` on body tag
2. **Auto-redirect Loop**: Use mounted state pattern for localStorage checks
3. **Prisma Browser Error**: Use API routes instead of direct Prisma calls

### Check Database
```bash
npx prisma studio
```

---

## License
Proprietary - All rights reserved