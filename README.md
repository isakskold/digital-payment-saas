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

- Tables are designed with a `tenantId` field to isolate customer data
- Example tables:
  - `tenants` – info about each customer (name, domain, colors)
  - `users` – links `clerkUserId` to `tenantId` and user role
  - `menus`, `products`, `orders` – all tied to a specific tenant
- Prisma is used for schema modeling and database queries

### API

- Backend logic is implemented via **Next.js Server Actions** or **`/api` routes**
- Each request checks tenant context and user auth before accessing data
- No external API layer needed (Next.js handles everything)
