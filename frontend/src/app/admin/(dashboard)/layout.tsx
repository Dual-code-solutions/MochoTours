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
import { useState } from 'react';
import { AdminSidebar } from '@/widgets/admin-sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-stone-50">
        {/* Barra Lateral Izquierda */}
        <div className="hidden md:block w-64 flex-shrink-0 fixed inset-y-0 z-50 md:relative">
          <AdminSidebar isOpen={true} onClose={() => {}} />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="fixed inset-0 bg-stone-900/80" onClick={() => setSidebarOpen(false)} />
            <div className="w-64 max-w-sm flex-shrink-0 relative">
               <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Zona Principal */}
        <div className="flex-1 overflow-x-hidden flex flex-col items-center">
          <div className="w-full max-w-5xl">
            {children}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
