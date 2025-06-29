# SaaS: Multitenant Pizza Ordering Platform

## Tech Stack

- **Next.js (App Router)** – Frontend and API (server components + server actions)
- **Clerk** – Authentication and user management
- **Supabase** – PostgreSQL database (data only, no auth)
- **Prisma** – ORM for database access
- **Vercel** – Hosting (frontend + API)

---

## Environment Variables

Create a `.env.local` file in the project root with:

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Clerk (add when implementing auth)
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
# CLERK_SECRET_KEY=your_clerk_secret_key
```

**Get these from:**

- Supabase Dashboard → Settings → Database → ORMs tab
- Replace `[YOUR-PROJECT-REF]` and `[YOUR-PASSWORD]` with your actual values

---

## Database Commands

### Initial Setup

```bash
# Install Prisma
npm install prisma @prisma/client

# Initialize Prisma
npx prisma init

# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Seed with test data
npm run db:seed
```

### Development Workflow

```bash
# After schema changes
npx prisma db push

# View/edit data
npx prisma studio

# Reset database (⚠️ deletes all data)
npx prisma db push --force-reset
```

---

## Current Functionality (Prototype Status)

### ✅ Completed Features

**Customer Ordering Flow:**

- Menu display with items and prices
- Add to cart functionality with visual feedback
- Cart management (add, remove, update quantities, special instructions)
- Persistent cart state across sessions
- Improved UX with bottom cart indicator and flash animations
- Checkout modal with customer information collection
- Order placement and confirmation
- Order status tracking modal

**Cart & Checkout Experience:**

- Reactive cart indicator at bottom of screen (hides when modals open)
- "Add to cart" button feedback (turns green, shows "Added!")
- Cart sidebar with item management
- Checkout form with delivery/pickup options
- Order confirmation with status tracking

**Order Management:**

- Order storage and persistence
- Order status states (PENDING, CONFIRMED, PREPARING, etc.)
- Order history and active order tracking

### 🚧 In Development

**Admin Panel (Next Priority):**

- Order management dashboard for restaurant staff
- Order status updates and notifications
- Kitchen workflow integration

### 🎯 Complete User Flow

1. **Customer visits restaurant subdomain** (e.g., `marios.localhost:3000`)
2. **Browses menu** and sees available items
3. **Adds items to cart** with immediate visual feedback
4. **Views cart** via bottom indicator or header button
5. **Proceeds to checkout** with customer details
6. **Places order** and receives confirmation
7. **Tracks order status** via order status modal

---

## Testing Multitenant Functionality

### How It Works

The app uses subdomains to identify different restaurant tenants:

1. **Middleware** extracts subdomain from hostname
2. **Database query** finds tenant by subdomain
3. **Page renders** with tenant-specific content
4. **Data fetched** from Supabase on every request

### Local Testing

Test different restaurant tenants using subdomains:

```
http://marios.localhost:3000
http://express.localhost:3000
http://gustavs.localhost:3000
```

No additional configuration needed - works out of the box!

### Test URLs

After seeding the database, you can test:

- **`http://marios.localhost:3000`** → Shows "Welcome to Mario's Pizza"
- **`http://express.localhost:3000`** → Shows "Welcome to Pizza Express"
- **`http://gustavs.localhost:3000`** → Shows "Welcome to Gustav's Pizzeria"
- **`http://localhost:3000`** → Shows "Restaurant Not Found" error

### Production

In production, restaurants will use:

- **Subdomains:** `marios.yourplatform.com`
- **Custom domains:** `mariospizza.se` (premium feature)

---

## Architecture Overview

### Multitenancy

- Each pizzeria is a **tenant**
- All data (menus, orders, settings) is linked via a `tenantId`
- Middleware or domain parser identifies the tenant based on the custom domain or subdomain

### Authentication (Clerk)

- Clerk handles signup, login, sessions, etc.
- Each Clerk user has a `userId` which is linked to the internal `tenantId` and role
- Protected routes use Clerk's `getAuth()` inside server functions or middleware

### Database (Supabase PostgreSQL)

- Tables are designed with proper relations to isolate tenant data
- Example tables:
  - `Tenant` – restaurant information (name, subdomain, domain, displayName)
  - `Menu` – restaurant menus (name, description, isDefault, sortOrder)
  - `MenuCategory` – menu categories (Pizzas, Drinks, Sides, etc.)
  - `MenuItem` – individual menu items (name, description, price, availability)
  - `User` – links `clerkUserId` to `tenantId` and user role (future)
  - `Order` – customer orders (future)
- All tables use proper foreign key relationships for data integrity
- Prisma is used for schema modeling and database queries

### API

- Backend logic is implemented via **Next.js Server Actions** or **`/api` routes**
- Each request checks tenant context and user auth before accessing data
- No external API layer needed (Next.js handles everything)

---

## Security (Prototype Phase)

### Current State: Unrestricted Access

**⚠️ For prototype development only - NOT production ready**

- **Database access is unrestricted** - Anyone with connection string can modify data
- **No authentication required** - No user verification for database operations
- **No Row Level Security (RLS)** - No data isolation policies
- **Direct Prisma access** - Full database control for rapid development

### Required for Production

**Phase 1: Basic Security**

- Implement Clerk authentication
- Add user management and roles
- Create protected admin API endpoints
- Basic input validation and sanitization

**Phase 2: Database Security**

- Enable Row Level Security (RLS) on all tables
- Create tenant-specific access policies
- Implement proper connection string security
- Add audit logging for data changes

**Phase 3: Advanced Security**

- API rate limiting and DDoS protection
- Advanced user permissions and role management
- Data encryption at rest and in transit
- Comprehensive audit trails
- Security monitoring and alerting

### Development vs Production

```env
# Development (current) - Unrestricted for speed
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Production (future) - Restricted and secure
DATABASE_URL="postgresql://service_user.[PROJECT-REF]:[SERVICE_PASSWORD]@aws-0-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"
```

**Note:** Keep this prototype setup for rapid development, but implement proper security before any production deployment or customer data handling.
