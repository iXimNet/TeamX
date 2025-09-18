import api from './api';
import { LoginCredentials, RegisterData } from '../types';

// The response we expect from the backend's /login or /register endpoint
interface AuthResponse {
  access_token: string;
}

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
};

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  return response.data;
};
