export type UserRole = 'super-admin' | 'store-manager';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  storeId?: string; // Only for store managers
  name: string;
}

export interface Store {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  isActive: boolean;
  operatingHours: {
    days: string;
    openTime: string;
    closeTime: string;
  };
  createdAt: string;
  managerId?: string;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  storeId: string;
  storeName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentMethod: 'gpay' | 'cash';
  orderStatus: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
  transactionId?: string;
}

export interface Payment {
  id: string;
  orderId: string;
  storeId: string;
  amount: number;
  paymentMethod: 'gpay' | 'cash';
  transactionId: string;
  status: 'success' | 'failed';
  timestamp: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: 'store' | 'product' | 'order' | 'payment';
  entityId: string;
  details: string;
  timestamp: string;
}

export interface DashboardStats {
  todayRevenue: number;
  revenueChange: number;
  lowStockItems: number;
  activeOrders: number;
  totalProducts: number;
}
