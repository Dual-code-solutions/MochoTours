'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getSiteContent } from '@/entities/site-content';
import { FALLBACK_DATA } from '@/shared/config/public-data';
import { MessageCircle, Phone, Mail } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import type { ContactInfo } from '@/shared/api/getContactInfo';

interface ContactFooterProps {
  contactInfo?: ContactInfo;
}

export function ContactFooter({ contactInfo }: ContactFooterProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [footerData, setFooterData] = useState<{
    titulo?: string | null;
    descripcion?: string | null;
    imagenUrl?: string | null;
  } | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch datos del backend (silencioso)
  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await getSiteContent();
        if (res?.footer) setFooterData(res.footer);
      } catch {
        // Silently fail → fallback local
      }
    };
    fetchFooter();
  }, []);

  // Datos de contenido (H2, Banner) de contenido_web
  const fallback = FALLBACK_DATA.footer;
  const titulo = fallback.titulo;
  const descripcion = fallback.descripcion;
  const imagenUrl = footerData?.imagenUrl || fallback.imagenUrl;

  // Datos dinámicos de contacto provenientes de ISR (contact_info)
  const phone1 = contactInfo?.phonePrimary || FALLBACK_DATA.contacto.telefono_whatsapp_principal;
  const phone2 = contactInfo?.phoneSecondary || FALLBACK_DATA.contacto.telefono_whatsapp_secundario;
  const emailVal = contactInfo?.email || 'contacto@mochotours.com';

  // SVG icons para redes (no existen en lucide-react)
  const FacebookIcon = () => (
    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
  );
  const InstagramIcon = () => (
    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
  );
  const TikTokIcon = () => (
    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.88-2.88 2.89 2.89 0 012.88-2.88c.28 0 .56.04.81.1v-3.5a6.37 6.37 0 00-.81-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.7 4.6 6.28 6.28 0 001.98-4.6V8.73A8.26 8.26 0 0019.59 10V6.69z"/></svg>
  );

  const redes = [
    { Icon: FacebookIcon, href: contactInfo?.facebookUrl || 'https://www.facebook.com/share/18C6QNCUUg/', label: 'Facebook' },
    { Icon: InstagramIcon, href: contactInfo?.instagramUrl || 'https://instagram.com/mochotours', label: 'Instagram' },
    { Icon: TikTokIcon, href: contactInfo?.tiktokUrl || 'https://tiktok.com/@mochotours', label: 'TikTok' },
  ];

  return (
    <footer ref={sectionRef} className="relative min-h-[600px] flex flex-col items-center justify-center overflow-hidden">
      
      {/* Imagen de fondo — cubre todo el footer */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${imagenUrl})` }}
      />

      {/* Contenido */}
      <div
        className="relative z-20 text-center px-6 py-20 max-w-3xl mx-auto"
        style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}
      >        
        {/* Label */}
        <span
          className={`text-white/70 text-sm font-semibold tracking-[0.25em] uppercase transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Contacto
        </span>

        {/* Título */}
        <h2
          className={`font-fraunces text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {titulo}
        </h2>

        {/* Subtítulo */}
        <p
          className={`text-white/80 text-lg mt-4 font-light transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {descripcion}
        </p>

        {/* Botón WhatsApp grande */}
        <div
          className={`mt-10 transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <Link href={`https://wa.me/${phone1}?text=Hola%2C%20me%20interesa%20reservar%20un%20tour%20de%20cenotes`} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              className="h-16 px-10 rounded-full bg-[#25D366] hover:bg-[#1DA851] text-white text-lg font-semibold shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all hover:scale-105"
            >
              <MessageCircle className="mr-3 h-6 w-6" />
              Reservar por WhatsApp
            </Button>
          </Link>
        </div>

        {/* Botones secundarios */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-3 mt-6 transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <Link href={`tel:+${phone1}`}>
            <Button variant="outline" className="rounded-full bg-white/20 backdrop-blur-sm border-white/50 text-white hover:bg-white hover:text-stone-900 px-6 transition-all active:scale-95">
              <Phone className="mr-2 h-4 w-4" />
              Llamar
            </Button>
          </Link>
          <Link href={`https://wa.me/${phone2}`} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="rounded-full bg-white/20 backdrop-blur-sm border-white/50 text-white hover:bg-white hover:text-stone-900 px-6 transition-all active:scale-95">
              <MessageCircle className="mr-2 h-4 w-4" />
              Línea secundaria
            </Button>
          </Link>
          <Link href={`mailto:${emailVal}`}>
            <Button variant="outline" className="rounded-full bg-white/20 backdrop-blur-sm border-white/50 text-white hover:bg-white hover:text-stone-900 px-6 transition-all active:scale-95">
              <Mail className="mr-2 h-4 w-4" />
              Correo
            </Button>
          </Link>
        </div>

        {/* Redes sociales */}
        <div
          className={`flex items-center justify-center gap-4 mt-12 transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {redes.map((red, i) => {
            const IconComp = red.Icon;
            return (
              <Link
                key={red.label}
                href={red.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visitar ${red.label}`}
                className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all hover:scale-110"
                style={{ transitionDelay: `${600 + i * 80}ms` }}
              >
                <IconComp />
              </Link>
            );
          })}
        </div>

      </div>

      {/* Barra inferior */}
      <div className="relative z-20 w-full border-t border-white/20 py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          {/* Logo pequeño */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Logo Mochótours"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-white/60 text-sm font-medium">Mochótours</span>
          </div>

          {/* Copyright */}
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} Cenotes Aventura y Más · Homún, Yucatán
          </p>

          {/* Créditos */}
          <p className="text-white/30 text-xs">
            Sitio creado por{' '}
            <span className="text-white/50 font-medium">Dual Code Solutions</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
