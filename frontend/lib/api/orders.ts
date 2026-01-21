import apiClient from './axios';
import { Order } from '@/types';

export const ordersApi = {
  getAll: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/orders');
    return response.data;
  },

  getById: async (id: number): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/${id}`);
    return response.data;
  },

  create: async (order: Partial<Order>): Promise<Order> => {
    const response = await apiClient.post<Order>('/orders', order);
    return response.data;
  },

  update: async (id: number, order: Partial<Order>): Promise<Order> => {
    const response = await apiClient.put<Order>(`/orders/${id}`, order);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/orders/${id}`);
  },

  getByUserId: async (userId: number): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>(`/orders/user/${userId}`);
    return response.data;
  },
};
