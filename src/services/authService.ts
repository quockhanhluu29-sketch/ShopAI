import axios from 'axios';
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

export const getAuthErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join(', ');
    if (typeof message === 'string') return message;
    if (error.code === 'ECONNABORTED') return 'Máy chủ phản hồi quá chậm. Hãy thử lại sau ít giây.';
    if (!error.response) return 'Không kết nối được backend. Hãy kiểm tra mạng và thử lại.';
  }
  return fallback;
};
