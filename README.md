# SkillShelf

A resource marketplace platform where creators can share learning materials, and learners can discover and save high-quality resources.

## What It Does

SkillShelf lets users browse, upload, and manage digital learning resources — PDFs, templates, UI kits, code snippets, study guides, and more. Creators get a personal dashboard to track their uploads, monitor performance analytics, and manage earnings. Visitors can explore the public library, bookmark favorites, and access free or paid resources.

## Features

- **Public Library** — Browse published resources by category, view featured picks on the homepage
- **Creator Dashboard** — Upload resources (auto-hosted via Vercel Blob), manage listings, and track stats (total resources, likes, earnings)
- **Analytics** — Charts showing likes over time, sales data, and category distribution
- **Bookmarks** — Save resources to a personal collection for quick access
- **Likes & Reviews** — Community engagement on each resource
- **Email Notifications** — Upload confirmation emails via Resend

## Tech Stack

- **Framework**: Next.js (App Router) + React 19
- **Database**: PostgreSQL (Neon Serverless) + Drizzle ORM
- **Auth**: Stack Auth
- **Storage**: Vercel Blob
- **UI**: Shadcn UI + Radix UI + Tailwind CSS
- **Charts**: Recharts
- **Email**: Resend
- **Language**: TypeScript

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

Create a `.env.local` file with the following:

```env
# Database
DATABASE_URL=

# Stack Auth
NEXT_PUBLIC_STACK_PROJECT_ID=
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=
STACK_SECRET_SERVER_KEY=

# Vercel Blob
BLOB_READ_WRITE_TOKEN=

# Resend
RESEND_API_KEY=
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── library/              # Public resource browser
│   ├── dashboard/            # Creator dashboard (auth required)
│   │   ├── my-resources/     # Manage own resources
│   │   └── analytics/        # Performance charts
│   ├── saved/                # Bookmarked resources
│   └── api/                  # API routes (upload, bookmarks)
├── components/               # Reusable UI components
├── db/                       # Drizzle schema and client
└── lib/                      # Utilities and helpers
```

## Deploy

Deploy instantly on [Vercel](https://vercel.com). Set the environment variables in your project settings and connect your Neon database.