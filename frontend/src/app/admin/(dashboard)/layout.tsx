'use client';

import { AuthGuard } from '@/features/auth-guard';

/**
 * Layout de las páginas protegidas del admin (dashboard).
 *
 * Todas las rutas dentro de /admin/(dashboard)/ pasan por AuthGuard:
 *   - /admin          → Dashboard
 *   - /admin/contenido → Gestión de contenido
 *   - /admin/galeria   → Gestión de galería
 *
 * La ruta /admin/login NO pasa por aquí porque está fuera
 * del route group (dashboard), así se evita el círculo vicioso
 * de redirigir al login cuando aún no estás logueado.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
