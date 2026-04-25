# BeautyBook - Beauty Service Booking Application

## 1. Project Overview

**Project Name:** BeautyBook
**Project Type:** Full-stack Mobile-first Web Application
**Core Functionality:** A last-minute and up-to-one-week-ahead booking platform for beauty and cosmetic services, connecting clients with businesses through real-time availability.
**Target Users:** Beauty service clients, salon/spa/business owners, platform administrators

## 2. Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Framer Motion
- **State Management:** Zustand
- **Icons:** Lucide React
- **Date Handling:** date-fns

## 3. UI/UX Specification

### Color Palette
```
Primary:        #E8B4B8 (Soft Rose)
Primary Dark:   #D49AA0 (Muted Rose)
Secondary:     #F5E6E8 (Pale Blush)
Accent:         #C9A87C (Warm Gold)
Background:     #FFFBFA (Warm White)
Surface:        #FFFFFF (White)
Text Primary:   #2D2A2A (Warm Black)
Text Secondary: #6B6565 (Warm Gray)
Text Muted:     #9A9595 (Light Gray)
Success:       #7CB98B (Soft Green)
Error:         #E57373 (Soft Red)
Warning:       #FFB74D (Soft Orange)
```

### Typography
- **Primary Font:** "Playfair Display" (headings), "DM Sans" (body)
- **Heading Sizes:** h1: 32px, h2: 24px, h3: 20px, h4: 18px
- **Body Sizes:** large: 16px, regular: 14px, small: 12px

### Spacing System
- Base unit: 4px
- Spacing: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64

### Border Radius
- Small: 8px
- Medium: 12px
- Large: 16px
- Full: 9999px

### Layout
- Mobile-first: max-width 480px centered on desktop
- Bottom nav: 64px height
- Safe area: 16px horizontal padding

### Animations
- Page transitions: fade + slide (300ms ease-out)
- Button press: scale(0.98) (100ms)
- Card hover: translateY(-2px) (200ms)
- Modal: fade + scale (250ms ease-out)

## 4. Page Structure

### 4.1 Landing Page (/)
Role Selection with 3 cards:
- Client (icon: user)
- Business (icon: store)
- admin (icon: shield)

### 4.2 Client Flow

#### Home (/client)
- Search bar at top
- Category grid (2 columns): Hair, Nails, Skin, Massage, Makeup, Brows
- Featured businesses section

#### Search (/client/search)
- Filter sidebar/tabs:
  - Service type dropdown
  - Subtype dropdown
  - Date picker
  - Time slots
  - Price range slider
- Results list with business cards

#### Service Location (/client/location/:id)
- Business header (name, address, rating)
- Time slots grid
- Reviews section
- Book button (fixed bottom)

#### Calendar (/client/calendar)
- Tab view: Past, Current, Upcoming
- Booking cards with status

#### Account (/client/account)
- Profile info
- Settings
- Logout

#### Auth (/client/auth)
- Login: email, password
- Register: name, phone, email, password

### 4.3 Business Flow

#### Application (/business/apply)
- Form fields:
  - Business name
  - Contact person
  - Phone
  - Email
  - Address
  - Description
- Submit button

#### Onboarding (/business/onboarding)
- Bank account connection modal
- Commission percentage display
- Agreement checkbox
- Confirm button

#### Dashboard (/business/dashboard)
- Schedule management
- Time slot adder
- Today's bookings
- Earnings overview

### 4.4 Admin Flow

#### Dashboard (/admin)
- Stats cards: users, businesses, bookings, revenue
- Pending approvals list

#### Businesses (/admin/businesses)
- Approve/reject actions
- Business list

#### Users (/admin/users)
- User list
- Search/filter

#### Settings (/admin/settings)
- Commission percentage
- Platform settings

## 5. Core Features

### 5.1 Real-time Availability
- Time slots stored as "gaps" in business schedule
- Slots marked available/unavailable
- Auto-expire old slots

### 5.2 Booking Flow (max 4 steps)
1. Select service/category
2. Choose date & time
3. Select business
4. Confirm booking

### 5.3 Authentication
- JWT-based auth
- Role-based access
- Session persistence

### 5.4 Notifications
- Booking confirmation
- Reminder (24h before)
- Status changes

## 6. Data Models

### User
```typescript
{
  id: string
  email: string
  password: string
  name: string
  phone: string
  role: 'client' | 'business' | 'admin'
  createdAt: Date
}
```

### Business
```typescript
{
  id: string
  name: string
  contactPerson: string
  phone: string
  email: string
  address: string
  description: string
  status: 'pending' | 'approved' | 'rejected'
  commission: number
  bankAccount?: BankAccount
  rating: number
  reviewCount: number
  createdAt: Date
}
```

### Service
```typescript
{
  id: string
  businessId: string
  category: string
  name: string
  subtype: string
  price: number
  duration: number // minutes
}
```

### TimeSlot
```typescript
{
  id: string
  businessId: string
  date: string // YYYY-MM-DD
  startTime: string // HH:mm
  endTime: string
  available: boolean
}
```

### Booking
```typescript
{
  id: string
  userId: string
  businessId: string
  serviceId: string
  slotId: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  totalPrice: number
  createdAt: Date
}
```

### Review
```typescript
{
  id: string
  userId: string
  businessId: string
  rating: number // 1-5
  comment: string
  createdAt: Date
}
```

## 7. Acceptance Criteria

1. ✅ Landing page displays 3 role options with icons
2. ✅ Client can browse categories and search services
3. ✅ Client can filter by type, subtype, date, time, price
4. ✅ Client can view business details and available slots
5. ✅ Client can book service (requires auth)
6. ✅ Business can apply and get approved
7. ✅ Business can add time slots to schedule
8. ✅ Admin can approve/reject businesses
9. ✅ All pages use consistent design system
10. ✅ Smooth animations and transitions
11. ✅ Mobile-first responsive layout
12. ✅ Max 4 steps to complete booking