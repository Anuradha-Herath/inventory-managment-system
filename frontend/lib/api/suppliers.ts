import apiClient from './axios';
import { Supplier } from '@/types';

export const suppliersApi = {
  getAll: async (active?: boolean): Promise<Supplier[]> => {
    const params = active !== undefined ? { active: active.toString() } : {};
    const response = await apiClient.get<Supplier[]>('/suppliers', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Supplier> => {
    const response = await apiClient.get<Supplier>(`/suppliers/${id}`);
    return response.data;
  },

  create: async (supplier: Partial<Supplier>): Promise<Supplier> => {
    const response = await apiClient.post<Supplier>('/suppliers', supplier);
    return response.data;
  },

  update: async (id: number, supplier: Partial<Supplier>): Promise<Supplier> => {
    const response = await apiClient.put<Supplier>(`/suppliers/${id}`, supplier);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/suppliers/${id}`);
  },
};
