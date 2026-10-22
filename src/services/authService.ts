import axiosClient from '@api/axiosClient';
import { API_ENDPOINTS } from '@constants/api';
import type { UserProfile } from '../types/orders';

interface AuthResponse {
  accessToken: string;
  user: UserProfile;
}

export const loginWithPassword = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axiosClient.post<AuthResponse>(API_ENDPOINTS.login, { email, password });
  return response.data;
};

export const registerAccount = async (
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const response = await axiosClient.post<AuthResponse>(API_ENDPOINTS.register, {
    name,
    email,
    password,
  });
  return response.data;
};