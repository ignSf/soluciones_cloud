// Base API config and Fetch Wrapper

const API_BASE_URL = 'http://localhost:8080/api/v1';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const setAuthToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
};

export const getSessionToken = (): string => {
  let sessionToken = localStorage.getItem('cart_session_token');
  if (!sessionToken) {
    sessionToken = 'sess-' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('cart_session_token', sessionToken);
  }
  return sessionToken;
};

export interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const token = getAuthToken();
  const sessionToken = getSessionToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Session-Token': sessionToken,
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}`;
    try {
      const errorJson = await response.json();
      errorMessage = errorJson.message || errorJson.error || errorMessage;
    } catch {
      // Ignorar si la respuesta de error no es JSON
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
