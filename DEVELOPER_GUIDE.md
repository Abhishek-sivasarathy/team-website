# Developer Guide - Campus Billing Admin

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open browser
http://localhost:3000
```

## Project Overview

This is a **prototype/low-fidelity admin portal** for managing campus outlet operations. It currently uses **local state and mock data** - no database or API required yet.

## Architecture Decisions

### Why React Context?
- **Simple**: Easy to understand for beginners
- **No Boilerplate**: Less setup than Redux
- **Sufficient**: Perfect for prototype with 5-10 components
- **Easy Migration**: Can switch to Redux/Zustand later

### Why LocalStorage?
- **Prototyping**: Persists data across page refreshes
- **No Backend**: Works without server/database
- **Quick Testing**: Instant data persistence
- **Easy Removal**: Simple to replace with API calls

### Folder Structure Explained

```
app/
├── login/              # Auth - Public route
├── dashboard/          # Protected - Shows after login
├── store/
│   ├── create/         # Super admin only
│   └── [storeId]/      # Dynamic routes for each store
│       ├── inventory/  # Main product management
│       ├── add-product/
│       ├── orders/
│       └── payments/
```

## State Management Deep Dive

### AppContext Structure

```typescript
const AppContext = {
  // Auth
  currentUser: User | null,
  login: (email, password) => boolean,
  logout: () => void,

  // Stores
  stores: Store[],
  addStore: (store) => void,
  updateStore: (id, updates) => void,
  getStoreById: (id) => Store,

  // Products
  products: Product[],
  addProduct: (product) => void,
  updateProduct: (id, updates) => void,
  toggleProductStock: (id) => void,
  getProductsByStore: (storeId) => Product[],

  // Orders
  orders: Order[],
  getOrdersByStore: (storeId) => Order[],
  updateOrderStatus: (orderId, status) => void,

  // Payments
  payments: Payment[],
  getPaymentsByStore: (storeId) => Payment[],

  // Audit Logs
  auditLogs: AuditLog[],
  addAuditLog: (log) => void,

  // Analytics
  getDashboardStats: (storeId?) => Stats,
};
```

### Using the Context

```typescript
// In any component
import { useApp } from '@/context/AppContext';

function MyComponent() {
  const { currentUser, products, addProduct } = useApp();
  
  // Access current user
  console.log(currentUser.name);
  
  // Add a product
  const handleAdd = () => {
    addProduct({
      storeId: 'rec-cafe',
      name: 'New Product',
      price: 5.99,
      category: 'Snacks',
      image: '',
      inStock: true,
      quantity: 50,
    });
  };
  
  return <button onClick={handleAdd}>Add Product</button>;
}
```

## Adding New Features

### Example: Add a "Duplicate Product" Feature

#### 1. Add function to AppContext

```typescript
// In context/AppContext.tsx

const duplicateProduct = (productId: string) => {
  const original = products.find(p => p.id === productId);
  if (!original) return;
  
  const duplicate: Product = {
    ...original,
    id: `prod-${Date.now()}`,
    name: `${original.name} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  setProducts([...products, duplicate]);
  
  if (currentUser) {
    addAuditLog({
      userId: currentUser.id,
      userName: currentUser.name,
      action: 'Product duplicated',
      entity: 'product',
      entityId: duplicate.id,
      details: `Duplicated: ${original.name}`,
    });
  }
};

// Add to context value
return (
  <AppContext.Provider value={{
    // ... existing values
    duplicateProduct,
  }}>
```

#### 2. Update TypeScript interface

```typescript
// In context/AppContext.tsx

interface AppContextType {
  // ... existing properties
  duplicateProduct: (productId: string) => void;
}
```

#### 3. Use in component

```typescript
// In app/store/[storeId]/inventory/page.tsx

const { duplicateProduct } = useApp();

// Add button to product card
<Button
  onClick={() => duplicateProduct(product.id)}
  variant="ghost"
  size="sm"
>
  Duplicate
</Button>
```

## Component Patterns

### Reusable UI Components

All UI components are in `components/ui/`:

```typescript
// Button usage
<Button variant="primary" size="lg" onClick={handleClick}>
  Click Me
</Button>

// Input usage
<Input
  label="Product Name"
  placeholder="Enter name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  icon={<Search />}
/>

// Card usage
<Card className="p-6">
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>

// Badge usage
<Badge variant="success">Active</Badge>
<Badge variant="danger">Inactive</Badge>

// Toggle usage
<Toggle
  checked={isActive}
  onChange={setIsActive}
/>
```

### Protected Route Pattern

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function ProtectedPage() {
  const { currentUser } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  return <div>Protected Content</div>;
}
```

### Form Handling Pattern

```typescript
const [formData, setFormData] = useState({
  name: '',
  price: '',
  category: '',
});

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validation
  if (!formData.name || !formData.price) {
    alert('Please fill all fields');
    return;
  }
  
  // Submit
  addProduct({
    ...formData,
    price: parseFloat(formData.price),
  });
  
  // Redirect
  router.push('/success');
};

return (
  <form onSubmit={handleSubmit}>
    <Input
      label="Name"
      value={formData.name}
      onChange={(e) => setFormData({
        ...formData,
        name: e.target.value
      })}
    />
    <Button type="submit">Submit</Button>
  </form>
);
```

## Styling Guide

### Tailwind Best Practices

```typescript
// ✅ Good: Utility classes
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md">

// ❌ Bad: Inline styles
<div style={{ display: 'flex', padding: '24px' }}>

// ✅ Good: Conditional classes
<div className={`p-4 ${isActive ? 'bg-green-100' : 'bg-gray-100'}`}>

// ✅ Good: Template literals for complex conditions
<div className={`
  flex items-center gap-2
  ${variant === 'primary' ? 'bg-blue-500 text-white' : 'bg-gray-200'}
  ${size === 'lg' ? 'p-6' : 'p-4'}
`}>
```

### Color Palette

```css
Primary Purple: #7C3AED (primary)
Dark Purple: #6D28D9 (primary-dark)
Light Purple: #8B5CF6 (primary-light)

Grays: gray-50, gray-100, gray-200, ... gray-900

Success: green-500, green-100
Warning: yellow-500, yellow-100
Danger: red-500, red-100
Info: blue-500, blue-100
```

## Testing Your Changes

### Manual Testing Checklist

1. **Login Flow**
   - [ ] Can login with any demo email
   - [ ] Redirects to dashboard after login
   - [ ] Logout works correctly

2. **Store Selection**
   - [ ] Super admin sees all stores
   - [ ] Store manager sees only their store
   - [ ] Store cards navigate correctly

3. **Inventory Management**
   - [ ] Products load correctly
   - [ ] Search filters products
   - [ ] Category tabs work
   - [ ] Stock toggle persists

4. **Add Product**
   - [ ] Form validates required fields
   - [ ] Image upload preview works
   - [ ] Product appears in inventory
   - [ ] Audit log created

5. **Orders**
   - [ ] Orders display correctly
   - [ ] Status updates work
   - [ ] Payment info shows

6. **Payments**
   - [ ] Revenue calculations correct
   - [ ] Payment history shows
   - [ ] Transaction details visible

### Testing Data Persistence

```typescript
// 1. Add a product
// 2. Refresh the page (F5)
// 3. Product should still be there (LocalStorage)

// Clear all data for fresh start
localStorage.clear();
// Then refresh page
```

## Common Issues & Solutions

### Issue: Page shows blank/loading forever

**Cause**: Context not initialized or user not logged in

**Solution**:
```typescript
// Check if user is null
if (!currentUser) {
  return <div>Loading...</div>;
  // or redirect
  router.push('/login');
}
```

### Issue: Data disappears on refresh

**Cause**: Not using LocalStorage correctly

**Solution**: Check AppContext - it automatically saves/loads from LocalStorage

### Issue: TypeScript errors

**Cause**: Missing type definitions

**Solution**:
```typescript
// Add proper types
const product: Product = { ... };
const handleClick = (id: string): void => { ... };
```

### Issue: Infinite re-render

**Cause**: Missing dependencies in useEffect

**Solution**:
```typescript
// ❌ Bad
useEffect(() => {
  setData(products);
});

// ✅ Good
useEffect(() => {
  setData(products);
}, [products]); // Add dependencies
```

## Preparing for Production

### When ready to add a database:

1. **Choose your database**: PostgreSQL, MongoDB, etc.
2. **Replace LocalStorage** with API calls:

```typescript
// Before (LocalStorage)
const addProduct = (product) => {
  setProducts([...products, product]);
  localStorage.setItem('products', JSON.stringify([...products, product]));
};

// After (API)
const addProduct = async (product) => {
  const response = await fetch('/api/products', {
    method: 'POST',
    body: JSON.stringify(product),
  });
  const newProduct = await response.json();
  setProducts([...products, newProduct]);
};
```

3. **Add authentication**: Replace mock login with real auth
4. **Add API routes**: Create `/api` folder in Next.js

## Next Steps

1. **Test thoroughly** with different user roles
2. **Add more stores** if needed
3. **Customize categories** per store
4. **Add export features** (PDF reports, Excel)
5. **Implement real-time** updates (WebSockets)
6. **Deploy** to Vercel/AWS

## Getting Help

- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- TypeScript: https://www.typescriptlang.org/docs
- React Context: https://react.dev/reference/react/useContext
