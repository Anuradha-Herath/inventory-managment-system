import apiClient from './axios';
import { LoginRequest, JwtResponse } from '@/types';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<JwtResponse> => {
    const response = await apiClient.post<JwtResponse>('/auth/login', credentials);
    return response.data;
  },
  
  // TODO: Add register endpoint when available
  // register: async (userData: RegisterRequest): Promise<JwtResponse> => {
  //   const response = await apiClient.post<JwtResponse>('/auth/register', userData);
  //   return response.data;
  // },
};
