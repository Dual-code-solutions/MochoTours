'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, ImageIcon, Phone, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoutButton } from '@/features/auth-logout';
import { ROUTES } from '@/shared/config/routes';

// ── Navegación ──────────────────────────────────────────────────────

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: ROUTES.ADMIN,
    icon: LayoutDashboard,
  },
  {
    label: 'Contenido del sitio',
    href: ROUTES.ADMIN_CONTENT,
    icon: FileText,
  },
  {
    label: 'Galería',
    href: ROUTES.ADMIN_GALLERY,
    icon: ImageIcon,
  },
  {
    label: 'Información de Contacto',
    href: ROUTES.ADMIN_CONTACT,
    icon: Phone,
  },
] as const;

// ── Props ───────────────────────────────────────────────────────────

type AdminSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

// ── Componente ──────────────────────────────────────────────────────

/**
 * Sidebar del panel de administración.
 *
 * DESKTOP: fijo a la izquierda (280px), siempre visible.
 * MÓVIL: oculto por defecto, se abre con botón hamburguesa (overlay).
 *
 * Contiene:
 *  - Logo arriba
 *  - Enlaces de navegación con highlight del activo
 *  - Botón de cerrar sesión al final
 */
export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  function isActive(href: string): boolean {
    if (href === ROUTES.ADMIN) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-stone-200">
      {/* ── Logo ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-stone-100">
        <Link href={ROUTES.ADMIN} onClick={onClose}>
          <Image
            src="/logo.png"
            alt="Mochótours Logo"
            width={160}
            height={48}
            className="h-10"
            style={{ width: 'auto' }}
          />
        </Link>

        {/* Botón cerrar — solo móvil */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
          aria-label="Cerrar menú"
        >
          <X className="size-5 text-stone-text" />
        </button>
      </div>

      {/* ── Navegación ─────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                ${
                  active
                    ? 'bg-primary/10 text-primary border-l-[3px] border-primary'
                    : 'text-stone-text hover:bg-stone-100 hover:text-stone-dark border-l-[3px] border-transparent'
                }
              `}
            >
              <Icon className={`size-5 ${active ? 'text-primary' : ''}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* ── Logout ─────────────────────────────────────────── */}
      <div className="px-3 py-4 border-t border-stone-200">
        <LogoutButton />
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop: sidebar fijo ──────────────────────────── */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="hidden lg:flex lg:flex-col lg:w-[280px] lg:fixed lg:inset-y-0 lg:left-0 lg:z-40"
      >
        {sidebarContent}
      </motion.aside>

      {/* ── Móvil: sidebar con overlay ─────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Fondo oscuro */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-50 bg-black/40 lg:hidden"
            />

            {/* Sidebar deslizante */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
