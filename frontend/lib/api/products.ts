import apiClient from './axios';
import { Product } from '@/types';

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>('/products');
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  create: async (product: Partial<Product>): Promise<Product> => {
    const response = await apiClient.post<Product>('/products', product);
    return response.data;
  },

  update: async (id: number, product: Partial<Product>): Promise<Product> => {
    const response = await apiClient.put<Product>(`/products/${id}`, product);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  getByCategory: async (categoryId: number): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(`/products/category/${categoryId}`);
    return response.data;
  },
};
