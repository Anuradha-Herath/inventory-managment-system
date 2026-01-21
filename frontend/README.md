# Smart Inventory Management System - Frontend

This is the frontend application for the Smart Inventory Management System, built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🔐 JWT-based authentication
- 📊 Admin dashboard
- 📦 Product management
- 🏷️ Category management
- 🛒 Order management
- 👥 User management
- 🔒 Protected routes
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── login/             # Login page
│   ├── dashboard/         # Dashboard page
│   ├── products/          # Products page
│   ├── categories/        # Categories page
│   ├── orders/            # Orders page
│   └── users/             # Users page
├── components/            # React components
│   ├── DashboardLayout.tsx
│   └── ProtectedRoute.tsx
├── lib/                   # Utilities and API clients
│   └── api/              # API service layer
├── store/                # State management (Zustand)
├── types/                # TypeScript type definitions
└── package.json
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
