/**
 * Rutas del frontend (Next.js App Router).
 * Se usan en navegación, redirects y links activos del sidebar.
 */

export const ROUTES = {
  // ── Públicas ──────────────────────────────────────────────────────
  HOME: '/',
  GALLERY: '/galeria',

  // ── Admin ─────────────────────────────────────────────────────────
  ADMIN: '/admin',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_CONTENT: '/admin/contenido',
  ADMIN_GALLERY: '/admin/galeria',
} as const;
