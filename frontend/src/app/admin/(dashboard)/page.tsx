import { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/shared/ui/card';
import { FileText, ImageIcon, PhoneCall, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import { ROUTES } from '@/shared/config/routes';

export const metadata: Metadata = {
  title: 'Dashboard | Admin Mochótours',
};

export default function AdminDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6">
      
      {/* ── Encabezado de Bienvenida ── */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center p-8 bg-primary/10 rounded-3xl border border-primary/20 relative overflow-hidden">
        <div className="z-10">
          <h1 className="text-3xl sm:text-4xl font-bold font-fraunces text-stone-900 mb-2">
            Panel de Control Central
          </h1>
          <p className="text-stone-600 text-lg">
            Bienvenido al sistema de administración. Todo está encriptado y asegurado para protección máxima de base de datos.
          </p>
        </div>
        <div className="hidden md:flex mt-4 md:mt-0 items-center justify-center bg-white p-4 rounded-[2rem] shadow-sm z-10 border border-primary/10">
           <ShieldCheck className="w-12 h-12 text-primary" strokeWidth={1.5} />
        </div>
        
        {/* Adorno Gráfico */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      </div>

      {/* ── Status Rápido ── */}
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold font-fraunces text-stone-800">Accesos Rápidos del Sistema</h2>
      </div>

      {/* ── Tarjetas de Modulos ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* MODULO 1 */}
        <Link href={ROUTES.ADMIN_CONTENT} className="group">
          <Card className="p-6 h-full hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:border-primary/50 transition-all duration-300">
             <div className="w-12 h-12 bg-stone-100 group-hover:bg-primary/10 rounded-2xl flex items-center justify-center transition-colors mb-4">
                <FileText className="w-6 h-6 text-stone-600 group-hover:text-primary" />
             </div>
             <h3 className="text-xl font-bold text-stone-900 mb-2">Contenido de la Web</h3>
             <p className="text-stone-500 text-sm mb-6 leading-relaxed">
               Modifica los textos principales (Hero), historias de los guías y características de la experiencia usando el gestor en vivo.
             </p>
             <div className="mt-auto flex items-center text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform">
               Administrar <ArrowRight className="w-4 h-4 ml-1" />
             </div>
          </Card>
        </Link>
        
        {/* MODULO 2 */}
        <Link href={ROUTES.ADMIN_GALLERY} className="group">
          <Card className="p-6 h-full hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:border-primary/50 transition-all duration-300">
             <div className="w-12 h-12 bg-stone-100 group-hover:bg-primary/10 rounded-2xl flex items-center justify-center transition-colors mb-4">
                <ImageIcon className="w-6 h-6 text-stone-600 group-hover:text-primary" />
             </div>
             <h3 className="text-xl font-bold text-stone-900 mb-2">Galería Multimedia</h3>
             <p className="text-stone-500 text-sm mb-6 leading-relaxed">
               Sube y recorta fotos automáticamente. Gestiona el material público que se mostrará en los deslizadores dinámicos.
             </p>
             <div className="mt-auto flex items-center text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform">
               Administrar <ArrowRight className="w-4 h-4 ml-1" />
             </div>
          </Card>
        </Link>

        {/* MODULO 3 */}
        <Link href={ROUTES.ADMIN_CONTACT} className="group">
          <Card className="p-6 h-full hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:border-primary/50 transition-all duration-300">
             <div className="w-12 h-12 bg-stone-100 group-hover:bg-primary/10 rounded-2xl flex items-center justify-center transition-colors mb-4">
                <PhoneCall className="w-6 h-6 text-stone-600 group-hover:text-primary" />
             </div>
             <h3 className="text-xl font-bold text-stone-900 mb-2">Telemetría de Contacto</h3>
             <p className="text-stone-500 text-sm mb-6 leading-relaxed">
               Ajusta números de WhatsApp, enlaces a Facebook/Instagram, correos electrónicos y ubica tu base de control en el mapa.
             </p>
             <div className="mt-auto flex items-center text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform">
               Administrar <ArrowRight className="w-4 h-4 ml-1" />
             </div>
          </Card>
        </Link>

      </div>

    </div>
  );
}
