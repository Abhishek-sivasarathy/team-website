# Campus Billing Admin

A production-grade Next.js admin portal for managing campus outlet inventory, orders, and payments.

## 🚀 Features

### Admin Capabilities
- **Multi-store Management**: Super admins can manage multiple campus outlets
- **Role-based Access**: Super Admin and Store Manager roles
- **Inventory Management**: Add products, manage stock levels, toggle availability
- **Live Orders**: Real-time order tracking and fulfillment
- **Payment History**: Complete transaction records and revenue analytics
- **Audit Logging**: All admin actions are logged for accountability

### Supported Stores
- REC CAFE - Coffee, Snacks & Pastries
- REC MART - Essentials & Groceries
- REC HUT - Meals & Beverages
- 6 SENSE - Premium Merchandise

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Icons**: Lucide React
- **Storage**: LocalStorage (prototype - will migrate to database)

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🔐 Demo Credentials

For prototype testing, use any of these emails with any password:

### Super Admin (Full Access)
- **Email**: admin@campus.edu
- **Access**: All stores

### Store Managers (Store-Specific Access)
- **REC CAFE**: cafe.manager@campus.edu
- **REC MART**: mart.manager@campus.edu
- **REC HUT**: hut.manager@campus.edu
- **6 SENSE**: sense.manager@campus.edu

## 📱 Application Structure

```
campus-billing-admin/
├── app/
│   ├── login/              # Authentication page
│   ├── dashboard/          # Store selection & stats
│   ├── store/
│   │   ├── create/         # Add new store (Super Admin only)
│   │   └── [storeId]/
│   │       ├── inventory/  # Product management
│   │       ├── add-product/ # Add new product
│   │       ├── orders/     # Live order tracking
│   │       └── payments/   # Payment history
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home redirect
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # Reusable UI components
│   └── layout/             # Layout components
├── context/
│   └── AppContext.tsx      # Global state management
├── lib/
│   └── mockData.ts         # Mock data for prototype
└── types/
    └── index.ts            # TypeScript type definitions
```

## 🎨 Key Pages

### 1. Login (`/login`)
- Email/password authentication
- Role-based access control
- Demo credentials display

### 2. Dashboard (`/dashboard`)
- Store selection cards
- Revenue statistics (Super Admin)
- Quick actions menu
- Low stock alerts

### 3. Store Inventory (`/store/[storeId]/inventory`)
- Product list with search
- Category filtering
- Stock toggle switches
- Quick add product button

### 4. Add Product (`/store/[storeId]/add-product`)
- Product details form
- Image upload
- Category selection (store-specific)
- Quantity tracking

### 5. Live Orders (`/store/[storeId]/orders`)
- Real-time order feed
- Order status management
- Payment verification
- Active/completed separation

### 6. Money Collection (`/store/[storeId]/payments`)
- Transaction history
- Revenue analytics
- Payment method tracking
- Order details linking

## 🔄 State Management

The app uses React Context API for global state:

```typescript
// Access app context
const {
  currentUser,
  stores,
  products,
  orders,
  payments,
  addProduct,
  toggleProductStock,
  updateOrderStatus,
  // ... more methods
} = useApp();
```

## 📊 Data Models

### User
- `id`, `email`, `name`, `role`, `storeId` (for managers)

### Store
- `id`, `name`, `description`, `icon`, `category`, `isActive`, `operatingHours`

### Product
- `id`, `storeId`, `name`, `price`, `category`, `image`, `inStock`, `quantity`

### Order
- `id`, `storeId`, `studentId`, `items[]`, `totalAmount`, `paymentStatus`, `orderStatus`

### Payment
- `id`, `orderId`, `amount`, `paymentMethod`, `transactionId`, `status`

### AuditLog
- `id`, `userId`, `action`, `entity`, `entityId`, `details`, `timestamp`

## 🚧 Roadmap (Post-Prototype)

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Real authentication system
- [ ] Google Pay API integration
- [ ] WebSocket for real-time updates
- [ ] Analytics dashboard
- [ ] Export reports (PDF/Excel)
- [ ] Mobile responsive improvements
- [ ] PWA support
- [ ] Email notifications
- [ ] Advanced inventory alerts

## 🔒 Security Notes

**Current prototype uses:**
- LocalStorage for data persistence (not production-ready)
- Mock authentication (accepts any password)
- No API encryption

**For production, implement:**
- JWT-based authentication
- Secure API endpoints
- Database with proper access control
- HTTPS only
- Input validation and sanitization
- Rate limiting
- CORS configuration

## 📝 License

This project is for educational/prototype purposes.

## 👥 Support

For questions or issues, contact your development team.
