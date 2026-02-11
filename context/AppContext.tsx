'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  Store,
  Product,
  Order,
  Payment,
  AuditLog,
  DashboardStats,
} from '@/types';
import {
  MOCK_USERS,
  MOCK_STORES,
  MOCK_PRODUCTS,
  MOCK_ORDERS,
  MOCK_PAYMENTS,
  MOCK_AUDIT_LOGS,
} from '@/lib/mockData';

interface AppContextType {
  // Auth
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;

  // Stores
  stores: Store[];
  addStore: (store: Omit<Store, 'id' | 'createdAt'>) => void;
  updateStore: (id: string, updates: Partial<Store>) => void;
  getStoreById: (id: string) => Store | undefined;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductsByStore: (storeId: string) => Product[];
  toggleProductStock: (id: string) => void;

  // Orders
  orders: Order[];
  getOrdersByStore: (storeId: string) => Order[];
  updateOrderStatus: (orderId: string, status: Order['orderStatus']) => void;

  // Payments
  payments: Payment[];
  getPaymentsByStore: (storeId: string) => Payment[];

  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  getAuditLogsByStore: (storeId: string) => AuditLog[];

  // Stats
  getDashboardStats: (storeId?: string) => DashboardStats;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [stores, setStores] = useState<Store[]>(MOCK_STORES);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);

  // Load from localStorage on mount (for persistence in prototype)
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    const savedStores = localStorage.getItem('stores');
    if (savedStores) {
      setStores(JSON.parse(savedStores));
    }

    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }

    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }

    const savedPayments = localStorage.getItem('payments');
    if (savedPayments) {
      setPayments(JSON.parse(savedPayments));
    }

    const savedLogs = localStorage.getItem('auditLogs');
    if (savedLogs) {
      setAuditLogs(JSON.parse(savedLogs));
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('stores', JSON.stringify(stores));
  }, [stores]);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('auditLogs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Auth functions
  const login = (email: string, password: string): boolean => {
    // Mock authentication - accept any password for prototype
    const user = MOCK_USERS.find((u) => u.email === email);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  // Store functions
  const addStore = (storeData: Omit<Store, 'id' | 'createdAt'>) => {
    const newStore: Store = {
      ...storeData,
      id: `store-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setStores([...stores, newStore]);
    
    if (currentUser) {
      addAuditLog({
        userId: currentUser.id,
        userName: currentUser.name,
        action: 'Store created',
        entity: 'store',
        entityId: newStore.id,
        details: `Created store: ${newStore.name}`,
      });
    }
  };

  const updateStore = (id: string, updates: Partial<Store>) => {
    setStores(stores.map((store) => (store.id === id ? { ...store, ...updates } : store)));
    
    if (currentUser) {
      addAuditLog({
        userId: currentUser.id,
        userName: currentUser.name,
        action: 'Store updated',
        entity: 'store',
        entityId: id,
        details: `Updated store settings`,
      });
    }
  };

  const getStoreById = (id: string) => {
    return stores.find((store) => store.id === id);
  };

  // Product functions
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts([...products, newProduct]);
    
    if (currentUser) {
      addAuditLog({
        userId: currentUser.id,
        userName: currentUser.name,
        action: 'Product added',
        entity: 'product',
        entityId: newProduct.id,
        details: `Added product: ${newProduct.name} (${newProduct.category})`,
      });
    }
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(
      products.map((product) =>
        product.id === id
          ? { ...product, ...updates, updatedAt: new Date().toISOString() }
          : product
      )
    );
    
    if (currentUser) {
      const product = products.find(p => p.id === id);
      addAuditLog({
        userId: currentUser.id,
        userName: currentUser.name,
        action: 'Product updated',
        entity: 'product',
        entityId: id,
        details: `Updated product: ${product?.name}`,
      });
    }
  };

  const deleteProduct = (id: string) => {
    const product = products.find(p => p.id === id);
    setProducts(products.filter((product) => product.id !== id));
    
    if (currentUser && product) {
      addAuditLog({
        userId: currentUser.id,
        userName: currentUser.name,
        action: 'Product deleted',
        entity: 'product',
        entityId: id,
        details: `Deleted product: ${product.name}`,
      });
    }
  };

  const getProductsByStore = (storeId: string) => {
    return products.filter((product) => product.storeId === storeId);
  };

  const toggleProductStock = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      const newStockStatus = !product.inStock;
      updateProduct(id, { 
        inStock: newStockStatus,
        quantity: newStockStatus ? product.quantity : 0
      });
      
      if (currentUser) {
        addAuditLog({
          userId: currentUser.id,
          userName: currentUser.name,
          action: newStockStatus ? 'Product marked in stock' : 'Product marked out of stock',
          entity: 'product',
          entityId: id,
          details: `${product.name} - ${newStockStatus ? 'In Stock' : 'Out of Stock'}`,
        });
      }
    }
  };

  // Order functions
  const getOrdersByStore = (storeId: string) => {
    return orders.filter((order) => order.storeId === storeId);
  };

  const updateOrderStatus = (orderId: string, status: Order['orderStatus']) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId
          ? { 
              ...order, 
              orderStatus: status,
              completedAt: status === 'completed' ? new Date().toISOString() : order.completedAt
            }
          : order
      )
    );
    
    if (currentUser) {
      const order = orders.find(o => o.id === orderId);
      addAuditLog({
        userId: currentUser.id,
        userName: currentUser.name,
        action: 'Order status updated',
        entity: 'order',
        entityId: orderId,
        details: `Order #${orderId} status changed to ${status}`,
      });
    }
  };

  // Payment functions
  const getPaymentsByStore = (storeId: string) => {
    return payments.filter((payment) => payment.storeId === storeId);
  };

  // Audit log functions
  const addAuditLog = (logData: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...logData,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const getAuditLogsByStore = (storeId: string) => {
    return auditLogs.filter((log) => {
      if (log.entity === 'product') {
        const product = products.find((p) => p.id === log.entityId);
        return product?.storeId === storeId;
      }
      if (log.entity === 'order') {
        const order = orders.find((o) => o.id === log.entityId);
        return order?.storeId === storeId;
      }
      if (log.entity === 'payment') {
        const payment = payments.find((p) => p.id === log.entityId);
        return payment?.storeId === storeId;
      }
      return log.entityId === storeId;
    });
  };

  // Dashboard stats
  const getDashboardStats = (storeId?: string): DashboardStats => {
    const relevantPayments = storeId
      ? payments.filter((p) => p.storeId === storeId && p.status === 'success')
      : payments.filter((p) => p.status === 'success');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayPayments = relevantPayments.filter(
      (p) => new Date(p.timestamp) >= today
    );

    const todayRevenue = todayPayments.reduce((sum, p) => sum + p.amount, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayPayments = relevantPayments.filter(
      (p) => new Date(p.timestamp) >= yesterday && new Date(p.timestamp) < today
    );

    const yesterdayRevenue = yesterdayPayments.reduce((sum, p) => sum + p.amount, 0);

    const revenueChange =
      yesterdayRevenue > 0
        ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100
        : todayRevenue > 0
        ? 100
        : 0;

    const relevantProducts = storeId
      ? products.filter((p) => p.storeId === storeId)
      : products;

    const lowStockItems = relevantProducts.filter(
      (p) => p.inStock && p.quantity < 10
    ).length;

    const activeOrders = storeId
      ? orders.filter(
          (o) =>
            o.storeId === storeId &&
            (o.orderStatus === 'pending' || o.orderStatus === 'preparing')
        ).length
      : orders.filter(
          (o) => o.orderStatus === 'pending' || o.orderStatus === 'preparing'
        ).length;

    return {
      todayRevenue,
      revenueChange,
      lowStockItems,
      activeOrders,
      totalProducts: relevantProducts.length,
    };
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        stores,
        addStore,
        updateStore,
        getStoreById,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductsByStore,
        toggleProductStock,
        orders,
        getOrdersByStore,
        updateOrderStatus,
        payments,
        getPaymentsByStore,
        auditLogs,
        addAuditLog,
        getAuditLogsByStore,
        getDashboardStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
