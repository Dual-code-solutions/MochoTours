/**
 * Rutas del backend (API REST).
 * Coinciden 1:1 con la Documentación de Endpoints del backend.
 */

// ── Auth ────────────────────────────────────────────────────────────
export const AUTH_LOGIN = '/api/auth/login';

// ── Galería ─────────────────────────────────────────────────────────
export const GALLERY = '/api/galeria';
export const GALLERY_BY_ID = (id: string) => `/api/galeria/${id}`;

// ── Contenido del sitio web ─────────────────────────────────────────
export const SITE_CONTENT = '/api/site-content';
export const SITE_CONTENT_BY_SECTION = (seccion: string) =>
  `/api/site-content/${seccion}`;

// ── Health ──────────────────────────────────────────────────────────
export const HEALTH = '/health';
