/**
 * API Client — Viña del Mal
 *
 * Capa base para comunicación con el backend FastAPI.
 * Si NEXT_PUBLIC_API_URL no está configurada, las funciones de servicio
 * hacen fallback a datos mock automáticamente.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  token?: string;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Fetch genérico con headers de tenant y auth.
 * Lanza ApiError si la respuesta no es ok.
 */
export async function apiFetch<T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  if (!API_URL) throw new ApiError('API no configurada', 0);

  const { method = 'GET', body, headers = {}, token } = options;

  const reqHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-tenant-slug': 'vinadelmal',
    ...headers,
  };

  if (token) reqHeaders['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: reqHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Error del servidor' }));
    throw new ApiError(
      typeof err.detail === 'string' ? err.detail : 'Error del servidor',
      res.status,
    );
  }

  return res.json();
}

/** ¿El backend está configurado? */
export function isApiAvailable(): boolean {
  return !!API_URL;
}
