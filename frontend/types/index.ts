export enum Role {
  ADMIN = 'ADMIN',  // Full access - can manage users, products, categories, suppliers, orders, reports
  STAFF = 'STAFF'   // Limited access - can view products, manage inventory, create/update orders
}

export enum OrderStatus {
  PENDING = 'PENDING',    // Order created, awaiting payment
  PAID = 'PAID',          // Payment received
  SHIPPED = 'SHIPPED',    // Order shipped to customer
  COMPLETED = 'COMPLETED', // Order completed and delivered
  CANCELLED = 'CANCELLED'  // Order cancelled
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  sku: string;
  categoryId: number;
  categoryName?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  userName?: string;
  status: OrderStatus;
  totalAmount: number;
  orderItems?: OrderItem[];
  payment?: Payment;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: number;
  orderId: number;
  method: string;
  status: string;
  amount: number;
  transactionId?: string;
  paymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: number;
  name: string;
  contactPerson?: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  role: string;
}
