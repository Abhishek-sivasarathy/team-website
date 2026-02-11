# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Next.js App Router                       │  │
│  │                                                        │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │   Login    │  │ Dashboard  │  │   Store    │     │  │
│  │  │   Page     │  │    Page    │  │   Pages    │     │  │
│  │  └────────────┘  └────────────┘  └────────────┘     │  │
│  │         │               │               │            │  │
│  │         └───────────────┴───────────────┘            │  │
│  │                         │                            │  │
│  │                         ▼                            │  │
│  │         ┌───────────────────────────────┐           │  │
│  │         │     AppContext (State)        │           │  │
│  │         │  - User Management            │           │  │
│  │         │  - Store Management           │           │  │
│  │         │  - Product Management         │           │  │
│  │         │  - Order Management           │           │  │
│  │         │  - Payment Tracking           │           │  │
│  │         │  - Audit Logging              │           │  │
│  │         └───────────────────────────────┘           │  │
│  │                         │                            │  │
│  └─────────────────────────┼────────────────────────────┘  │
│                             │                               │
│                             ▼                               │
│                  ┌──────────────────────┐                  │
│                  │   LocalStorage       │                  │
│                  │  (Temporary DB)      │                  │
│                  └──────────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Authentication Flow
```
┌──────┐      ┌─────────┐      ┌──────────┐      ┌───────────┐
│Login │─────>│useApp() │─────>│AppContext│─────>│Dashboard  │
│Page  │      │.login() │      │.setUser  │      │(Protected)│
└──────┘      └─────────┘      └──────────┘      └───────────┘
```

### 2. Product Management Flow
```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│Add Product  │─────>│  AppContext  │─────>│LocalStorage │
│   Page      │      │ .addProduct()│      │  .setItem() │
└─────────────┘      └──────────────┘      └─────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │ Audit Log    │
                     │ (Auto-added) │
                     └──────────────┘
```

### 3. Order Status Update Flow
```
┌──────────┐      ┌────────────────────┐      ┌─────────────┐
│ Orders   │─────>│    AppContext      │─────>│State Update │
│  Page    │      │.updateOrderStatus()│      │  + Audit    │
└──────────┘      └────────────────────┘      └─────────────┘
                           │
                           ▼
                  ┌────────────────┐
                  │  LocalStorage  │
                  │    Persist     │
                  └────────────────┘
```

## Component Hierarchy

```
App
│
├── Layout (Root)
│   └── AppProvider (Context)
│       │
│       ├── Login Page
│       │   ├── Input (email)
│       │   ├── Input (password)
│       │   └── Button (submit)
│       │
│       ├── Dashboard Page
│       │   ├── Header
│       │   ├── Stats Cards
│       │   └── Store Cards
│       │       └── Button (manage)
│       │
│       └── Store Pages
│           ├── Inventory Page
│           │   ├── Header
│           │   ├── Search Input
│           │   ├── Category Tabs
│           │   └── Product Cards
│           │       ├── Product Image
│           │       ├── Product Info
│           │       └── Stock Toggle
│           │
│           ├── Add Product Page
│           │   ├── Image Upload
│           │   ├── Input (name)
│           │   ├── Input (price)
│           │   ├── Select (category)
│           │   └── Button (submit)
│           │
│           ├── Orders Page
│           │   ├── Stats Cards
│           │   └── Order Cards
│           │       ├── Order Info
│           │       ├── Items List
│           │       └── Action Buttons
│           │
│           └── Payments Page
│               ├── Revenue Stats
│               └── Payment List
│                   └── Payment Cards
```

## State Management Structure

```typescript
AppContext State
│
├── Authentication
│   ├── currentUser: User | null
│   ├── login(email, password): boolean
│   └── logout(): void
│
├── Stores
│   ├── stores: Store[]
│   ├── addStore(store): void
│   ├── updateStore(id, updates): void
│   └── getStoreById(id): Store
│
├── Products
│   ├── products: Product[]
│   ├── addProduct(product): void
│   ├── updateProduct(id, updates): void
│   ├── toggleProductStock(id): void
│   └── getProductsByStore(storeId): Product[]
│
├── Orders
│   ├── orders: Order[]
│   ├── getOrdersByStore(storeId): Order[]
│   └── updateOrderStatus(orderId, status): void
│
├── Payments
│   ├── payments: Payment[]
│   └── getPaymentsByStore(storeId): Payment[]
│
├── Audit Logs
│   ├── auditLogs: AuditLog[]
│   ├── addAuditLog(log): void
│   └── getAuditLogsByStore(storeId): AuditLog[]
│
└── Analytics
    └── getDashboardStats(storeId?): Stats
```

## Routing Structure

```
/                           → Redirects to /login or /dashboard
│
├── /login                  → Public route (Login page)
│
├── /dashboard              → Protected route (Store selection)
│
├── /store/create           → Protected (Super Admin only)
│
└── /store/[storeId]/
    ├── inventory           → Protected (Product list)
    ├── add-product         → Protected (Add new product)
    ├── orders              → Protected (Live orders)
    └── payments            → Protected (Payment history)
```

## Role-Based Access Control

```
User Roles
│
├── Super Admin
│   ├── Can access: ALL stores
│   ├── Can create: New stores
│   ├── Can manage: All products
│   ├── Can view: All orders & payments
│   └── Can see: Global analytics
│
└── Store Manager
    ├── Can access: Assigned store only
    ├── Cannot create: Stores
    ├── Can manage: Store products
    ├── Can view: Store orders & payments
    └── Can see: Store-specific analytics
```

## Technology Stack

```
Frontend
│
├── Framework
│   └── Next.js 15 (App Router, Server Components)
│
├── Language
│   └── TypeScript (Type safety)
│
├── Styling
│   └── Tailwind CSS (Utility-first)
│
├── State Management
│   └── React Context API
│
├── Icons
│   └── Lucide React
│
└── Storage (Prototype)
    └── Browser LocalStorage
```

## Future Architecture (Production)

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (Client)                     │
│                      Next.js App                         │
└─────────────────┬───────────────────────────────────────┘
                  │ HTTP/HTTPS
                  ▼
┌─────────────────────────────────────────────────────────┐
│                  Next.js API Routes                      │
│              /api/auth, /api/products, etc.             │
└─────────────────┬───────────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
┌──────────────┐    ┌──────────────┐
│ PostgreSQL/  │    │  Redis Cache │
│   MongoDB    │    │   (Optional) │
└──────────────┘    └──────────────┘
        │
        ▼
┌──────────────────┐
│  File Storage    │
│  (AWS S3 /       │
│   Cloudinary)    │
└──────────────────┘
```

## Security Layers (To Be Added)

```
Production Security
│
├── Authentication
│   ├── JWT Tokens
│   ├── Secure password hashing (bcrypt)
│   └── Session management
│
├── Authorization
│   ├── Role-based access control
│   ├── API route protection
│   └── Data filtering by user role
│
├── Data Protection
│   ├── Input validation
│   ├── SQL injection prevention
│   ├── XSS protection
│   └── CSRF tokens
│
└── Infrastructure
    ├── HTTPS only
    ├── Rate limiting
    ├── CORS configuration
    └── Environment variables
```

## Performance Considerations

```
Current Setup (Prototype)
├── ✅ Instant page loads (no API calls)
├── ✅ Fast state updates (in-memory)
├── ✅ No network latency
└── ⚠️  Limited to LocalStorage size

Production Optimizations Needed
├── Server-side rendering (SSR)
├── Static page generation (SSG)
├── Image optimization
├── Code splitting
├── Lazy loading
├── Database indexing
├── API caching
└── CDN for assets
```

## Deployment Architecture (Future)

```
                    ┌─────────────┐
                    │   Users     │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │     CDN     │
                    │(CloudFlare) │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Vercel/   │
                    │     AWS     │
                    │(Next.js App)│
                    └──────┬──────┘
                           │
                ┌──────────┴──────────┐
                ▼                     ▼
         ┌─────────────┐      ┌─────────────┐
         │  Database   │      │   Storage   │
         │  (AWS RDS)  │      │  (AWS S3)   │
         └─────────────┘      └─────────────┘
```

## Development Workflow

```
1. Local Development
   ├── npm run dev
   ├── Test features
   └── Debug with console

2. Git Commit
   ├── git add .
   ├── git commit -m "message"
   └── git push

3. Production Build
   ├── npm run build
   ├── Test build locally
   └── Fix any issues

4. Deploy
   ├── Vercel (auto-deploy from Git)
   └── OR AWS (manual deploy)

5. Monitor
   ├── Check logs
   ├── Monitor errors
   └── Track performance
```
