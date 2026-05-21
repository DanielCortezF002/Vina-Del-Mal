/**
 * API de Autenticación — Viña del Mal
 */

import { apiFetch } from '../api';

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    rut: string;
  };
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  isAdmin: boolean;
}

export async function loginApi(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export async function getMeApi(token: string): Promise<AuthUser> {
  return apiFetch<AuthUser>('/auth/me', { token });
}
