'use client';

import { API_URL } from '@/shared/config/env';
import { ROUTES } from '@/shared/config/routes';
import { ApiException } from './types';
import type { ValidationFieldError } from './types';

// ── Constantes ──────────────────────────────────────────────────────

const TOKEN_KEY = 'token';

// ── Helpers de token ────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ── Manejo de respuestas ────────────────────────────────────────────

async function handleResponse<T>(response: Response): Promise<T> {
  // Si el token expiró o es inválido, limpiar y redirigir
  if (response.status === 401) {
    removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = ROUTES.ADMIN_LOGIN;
    }
    throw new ApiException('Sesión expirada. Inicia sesión nuevamente.', 401);
  }

  // Permisos insuficientes
  if (response.status === 403) {
    throw new ApiException(
      'No tienes permisos para realizar esta acción.',
      403
    );
  }

  const json = await response.json();

  // Respuesta exitosa
  if (response.ok && json.success) {
    return json as T;
  }

  // Error de validación del backend (400)
  if (response.status === 400 && json.errors) {
    throw new ApiException(
      'Error de validación',
      400,
      json.errors as ValidationFieldError[]
    );
  }

  // Error genérico del backend
  throw new ApiException(
    json.error || json.message || 'Error inesperado del servidor',
    response.status
  );
}

// ── Headers base ────────────────────────────────────────────────────

function buildHeaders(withAuth: boolean): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (withAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

// ── Métodos del cliente ─────────────────────────────────────────────

/**
 * GET request.
 * @param path - Ruta relativa (ej: '/api/galeria')
 * @param params - Query params opcionales
 * @param withAuth - Si se debe enviar el token (default: false)
 */
async function get<T>(
  path: string,
  params?: Record<string, string | number>,
  withAuth = false
): Promise<T> {
  const url = new URL(path, API_URL);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: buildHeaders(withAuth),
  });

  return handleResponse<T>(response);
}

/**
 * POST request con JSON body.
 * @param path - Ruta relativa
 * @param body - Objeto que se envía como JSON
 * @param withAuth - Si se debe enviar el token (default: true)
 */
async function post<T>(
  path: string,
  body: Record<string, unknown>,
  withAuth = true
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: buildHeaders(withAuth),
    body: JSON.stringify(body),
  });

  return handleResponse<T>(response);
}

/**
 * POST request con FormData (multipart/form-data).
 * Usado para subir archivos (galería, site-content).
 * NO se pone Content-Type, el browser lo añade con el boundary.
 *
 * @param path - Ruta relativa
 * @param formData - FormData con los campos y archivos
 * @param withAuth - Si se debe enviar el token (default: true)
 */
async function postFormData<T>(
  path: string,
  formData: FormData,
  withAuth = true
): Promise<T> {
  const headers: Record<string, string> = {};

  if (withAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  return handleResponse<T>(response);
}

/**
 * DELETE request.
 * @param path - Ruta relativa (ej: '/api/galeria/uuid')
 * @param withAuth - Si se debe enviar el token (default: true)
 */
async function del<T>(path: string, withAuth = true): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'DELETE',
    headers: buildHeaders(withAuth),
  });

  return handleResponse<T>(response);
}

// ── Export del cliente ───────────────────────────────────────────────

export const apiClient = {
  get,
  post,
  postFormData,
  delete: del,
} as const;
