import type { NextConfig } from 'next';

/**
 * Configuración de Next.js para MochoTours.
 *
 * Ref: framework_y_seo.txt →
 *   - MANEJO ÓPTIMO DE IMÁGENES → #3 CONFIGURACIÓN DE DOMINIOS
 *   - OPTIMIZACIÓN AUTOMÁTICA DE IMÁGENES
 */
const nextConfig: NextConfig = {
  // ── Optimización de imágenes ───────────────────────────────────────
  // Permite al componente <Image> de Next.js procesar imágenes
  // remotas desde Supabase Storage y generar formatos WebP/AVIF
  // automáticamente con múltiples tamaños.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nsbjrbpfclxyvgvzqpdt.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'wgrlytkoofupwnmerkju.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Formatos modernos que Next.js generará automáticamente
    // WebP: ~30% más ligero que JPG | AVIF: ~50% más ligero
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
