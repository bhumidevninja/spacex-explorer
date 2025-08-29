# 🚀 SpaceX Explorer

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14.2.0-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-18.3.1-61dafb?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.0-38b2ac?style=for-the-badge&logo=tailwind-css" alt="TailwindCSS" />
</div>

<div align="center">
  <h3>✨ Journey Through Space with SpaceX ✨</h3>
  <p>A stunning, immersive web application for exploring SpaceX launches, rockets, and missions with a cosmic space theme.</p>
</div>

## 🌌 Features

### Core Features

- **🚀 Launch Explorer**: Browse all SpaceX launches with infinite scroll
- **🔍 Advanced Filtering**: Filter by status, success, date range with custom space-themed dropdowns
- **📊 Statistics Dashboard**: Interactive charts showing launch trends, success rates, and more
- **⭐ Favorites System**: Save your favorite launches with LocalStorage persistence
- **🔄 Launch Comparison**: Compare two launches side-by-side with detailed metrics
- **📱 Responsive Design**: Fully responsive with mobile-first approach

### Space Theme Features

- **🌟 Animated Starfield**: Dynamic star background with twinkling effects
- **🎨 Glassmorphism UI**: Semi-transparent cards with backdrop blur
- **💫 Gradient Effects**: Purple, blue, and cyan gradients throughout
- **✨ Smooth Animations**: Floating, pulsing, and glowing effects
- **🌈 Custom Components**: Space-themed dropdowns, buttons, and cards

## 🛠 Tech Stack

### Frontend

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom CSS
- **State Management**: [React Query (TanStack Query)](https://tanstack.com/query)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Performance**: [react-window](https://github.com/bvaughn/react-window) for virtualization

### API

- **Data Source**: [SpaceX API v4](https://github.com/r-spacex/SpaceX-API)
- **Endpoints Used**:
  - `POST /launches/query` - Server-side pagination
  - `GET /rockets/:id` - Rocket details
  - `GET /launchpads/:id` - Launch site information

## 📦 Installation

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/bhumidevninja/spacex-explorer.git
cd spacex-explorer
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Run development server**

```bash
npm run dev
# or
yarn dev
```

4. **Open in browser**

```
http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## 🏗 Project Structure

```
spacex-explorer/
├── app/                      # Next.js app router
│   ├── layout.tsx           # Root layout with cosmic background
│   ├── page.tsx             # Home page with launch list
│   ├── launches/
│   │   └── [id]/
│   │       └── page.tsx     # Launch detail page
│   ├── favorites/
│   │   └── page.tsx         # Favorites page
│   ├── compare/
│   │   └── page.tsx         # Launch comparison page
│   ├── stats/
│   │   └── page.tsx         # Statistics dashboard
│   └── globals.css          # Global styles with space theme
│
├── components/
│   ├── launches/
│   │   ├── LaunchCard.tsx       # Launch card with glassmorphism
│   │   ├── LaunchFilters.tsx    # Custom dropdown filters
│   │   └── LaunchSkeleton.tsx   # Loading skeletons
│   ├── ui/
│   │   ├── Button.tsx           # Gradient buttons
│   │   ├── Card.tsx             # Glass-morphism cards
│   │   └── CustomDropdown.tsx   # Space-themed dropdowns
│   └── layout/
│       ├── Header.tsx           # Navigation with blur effect
│       └── Footer.tsx           # Footer with gradient
│
├── lib/
│   ├── api/
│   │   ├── spacex.ts           # API client with retry logic
│   │   └── types.ts            # TypeScript type definitions
│   ├── hooks/
│   │   ├── useLaunches.ts      # React Query hooks
│   │   ├── useFavorites.ts     # Favorites management
│   │   └── useInfiniteScroll.ts # Infinite scroll hook
│   └── utils/
│       ├── date.ts             # Date formatting utilities
│       └── storage.ts          # LocalStorage helpers
│
├── public/                     # Static assets
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── tailwind.config.js         # Tailwind configuration
└── next.config.js             # Next.js configuration
```

## 🎨 Design System

### Color Palette

```css
/* Primary Gradients */
--gradient-purple-blue: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--gradient-blue-cyan: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);

/* Background */
--bg-primary: #0a0a0f;
--bg-secondary: #1a0f2e;
--bg-card: rgba(31, 41, 55, 0.5);

/* Text */
--text-primary: #ffffff;
--text-secondary: #e2e8f0;
--text-muted: #9ca3af;

/* Status Colors */
--success: #10b981;
--failure: #ef4444;
--upcoming: #3b82f6;
```

### Typography

- **Headings**: Inter font with gradient text effects
- **Body**: System fonts with proper line height
- **Data**: Monospace font for numbers and technical info

### Components

- **Cards**: Glassmorphism with backdrop-blur
- **Buttons**: Gradient backgrounds with hover effects
- **Dropdowns**: Custom floating panels with animations
- **Inputs**: Semi-transparent with purple focus rings

## 🚀 Key Features Implementation

### 1. Server-Side Pagination

```typescript
// Efficient data loading using SpaceX API query endpoint
const query = {
  options: {
    limit: 20,
    offset: pageParam,
    sort: { date_unix: -1 },
  },
};
```

### 2. React Query Caching

```typescript
// Smart caching with different stale times
queryClient.setDefaults({
  queries: {
    staleTime: 60000, // 1 minute for launches
    cacheTime: 300000, // 5 minutes cache
  },
});
```

### 3. Virtual Scrolling

```typescript
// Performance optimization for large lists
import { FixedSizeList } from "react-window";
```

### 4. Custom Dropdowns

```typescript
// Space-themed dropdown replacing native selects
<CustomDropdown value={value} options={options} onChange={onChange} />
```

## 📊 Performance Optimizations

- **Code Splitting**: Automatic with Next.js App Router
- **Image Optimization**: Next.js Image component with lazy loading
- **Bundle Size**: Tree-shaking and dynamic imports
- **Caching Strategy**:
  - Launches: 1 minute stale time
  - Rockets: 1 hour stale time
  - Static data: Cached indefinitely
- **Virtual DOM**: React.memo for expensive components
- **CSS**: Tailwind CSS with PurgeCSS for minimal bundle

## ♿ Accessibility

- **Semantic HTML**: Proper heading hierarchy and ARIA labels
- **Keyboard Navigation**: Full keyboard support with visible focus
- **Screen Readers**: Announced loading states and changes
- **Color Contrast**: WCAG AA compliant
- **Focus Management**: Proper focus restoration
- **Responsive**: Mobile-first responsive design

## 🔒 Environment Variables

No environment variables required! The SpaceX API is public and doesn't require authentication.

## 📝 Scripts

```json
{
  "dev": "next dev", // Development server
  "build": "next build", // Production build
  "start": "next start", // Production server
  "lint": "next lint", // ESLint
  "type-check": "tsc --noEmit" // TypeScript checking
}
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Deploy with zero configuration
   start
