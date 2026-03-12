# Ecom Scaffold

A React + Vite + TypeScript scaffold with Tailwind CSS, React Router, Axios, TanStack React Query, Zustand, and shadcn/ui compatible structure.

## Getting Started

```bash
npm install
npm run dev
```

## Tech Stack

- **React** — UI library
- **Vite** — Build tool
- **TypeScript** — Type safety
- **Tailwind CSS** — Utility-first styling
- **React Router v6** — Client-side routing
- **Axios** — HTTP client
- **TanStack React Query** — Server state management
- **Zustand** — Client state management
- **shadcn/ui compatible** — Component structure under `src/components/ui`

## Project Structure

```
src/
├── components/   # Reusable UI components
├── hooks/        # Custom React hooks
├── pages/        # Route-level page components
├── stores/       # Zustand global stores
├── i18n/         # Internationalisation
├── lib/          # API client, endpoints, utilities
└── types/        # Shared TypeScript types
```

```
ecom-scaffold
├─ index.html
├─ package.json
├─ postcss.config.js
├─ README.md
├─ src
│  ├─ App.tsx
│  ├─ components
│  │  ├─ layout
│  │  │  ├─ Footer.tsx
│  │  │  └─ Navbar.tsx
│  │  ├─ NavLink.tsx
│  │  ├─ products
│  │  │  ├─ ProductCard.tsx
│  │  │  └─ ProductGrid.tsx
│  │  ├─ shared
│  │  │  ├─ EmptyState.tsx
│  │  │  ├─ LoadingSkeleton.tsx
│  │  │  ├─ PaginationControls.tsx
│  │  │  ├─ ProtectedRoute.tsx
│  │  │  ├─ QuantitySelector.tsx
│  │  │  └─ RatingStars.tsx
│  │  └─ ui
│  │     └─ Button.tsx
│  ├─ hooks
│  │  ├─ useAddresses.ts
│  │  ├─ useAuth.ts
│  │  ├─ useCart.ts
│  │  ├─ useOrders.ts
│  │  ├─ useProducts.ts
│  │  ├─ useReviews.ts
│  │  └─ useWishlist.ts
│  ├─ i18n
│  │  ├─ I18nProvider.tsx
│  │  └─ translations.ts
│  ├─ index.css
│  ├─ lib
│  │  ├─ api.ts
│  │  ├─ endpoints.ts
│  │  └─ utils.ts
│  ├─ main.tsx
│  ├─ pages
│  │  ├─ AccountPage.tsx
│  │  ├─ AddressesPage.tsx
│  │  ├─ BrandsPage.tsx
│  │  ├─ CartPage.tsx
│  │  ├─ CategoriesPage.tsx
│  │  ├─ CheckoutPage.tsx
│  │  ├─ ForgotPasswordPage.tsx
│  │  ├─ HomePage.tsx
│  │  ├─ LoginPage.tsx
│  │  ├─ NotFound.tsx
│  │  ├─ OrdersPage.tsx
│  │  ├─ ProductDetailPage.tsx
│  │  ├─ ProductsPage.tsx
│  │  ├─ RegisterPage.tsx
│  │  └─ WishlistPage.tsx
│  ├─ stores
│  │  └─ authStore.ts
│  └─ types
│     └─ api.ts
├─ tailwind.config.ts
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts

```