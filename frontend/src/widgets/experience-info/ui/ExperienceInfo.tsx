'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getSiteContent } from '@/entities/site-content';
import { FALLBACK_DATA } from '@/shared/config/public-data';
import {
  Clock, Trees, Bike, MapPin, Users, Languages,
  Backpack, Baby, Settings,
} from 'lucide-react';

// Mapeo de strings a componentes Lucide
const ICON_MAP: Record<string, React.ElementType> = {
  clock: Clock,
  trees: Trees,
  bike: Bike,
  'map-pin': MapPin,
  users: Users,
  languages: Languages,
  backpack: Backpack,
  baby: Baby,
  settings: Settings,
};

export function ExperienceInfo() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mototaxiData, setMototaxiData] = useState<{
    titulo?: string | null;
    descripcion?: string | null;
    imagenUrl?: string | null;
  } | null>(null);

  // Intersection Observer para animaciones al scroll
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

  // Fetch datos del backend (silencioso, con fallback local)
  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await getSiteContent();
        if (res?.experience_mototaxi) {
          setMototaxiData(res.experience_mototaxi);
        }
      } catch {
        // Silently fail → fallback local se mantiene
      }
    };
    fetchExperience();
  }, []);

  // Parallax del mototaxi
  const bannerRef = useRef<HTMLDivElement>(null);
  const [bannerOffset, setBannerOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!bannerRef.current) return;
      const rect = bannerRef.current.getBoundingClientRect();
      const viewH = window.innerHeight;
      if (rect.top < viewH && rect.bottom > 0) {
        const progress = (viewH - rect.top) / (viewH + rect.height);
        setBannerOffset(progress * 60 - 30);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { tarjetas, mototaxi } = FALLBACK_DATA.experiencia;
  const mototaxiImagen = mototaxiData?.imagenUrl || mototaxi.imagenUrl;
  const mototaxiTitulo = mototaxiData?.titulo || mototaxi.titulo;
  const mototaxiDescripcion = mototaxiData?.descripcion || mototaxi.descripcion;

  return (
    <section ref={sectionRef} className="relative bg-white pt-32 lg:pt-40 pb-20 lg:pb-32 -mt-8 rounded-t-[2.5rem] z-30 shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.2)]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">

        {/* ═══ ENCABEZADO ═══ */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="flex justify-center mb-3">
            <span className="text-primary text-sm font-semibold tracking-[0.2em] uppercase">
              La Experiencia
            </span>
          </div>
          <h2 className="font-fraunces text-4xl lg:text-5xl font-bold text-stone-900 leading-tight">
            Qué incluye tu aventura
          </h2>
          <p className="text-stone-600 mt-4 max-w-2xl mx-auto text-base lg:text-lg font-light text-left sm:text-center">
            Todo lo que necesitas saber antes de vivir una experiencia inolvidable
            en los cenotes más impresionantes de Homún, Yucatán.
          </p>
        </div>

        {/* ═══ GRID DE 9 TARJETAS ═══ */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {tarjetas.map((card, index) => {
            const IconComponent = ICON_MAP[card.icon] || Settings;
            return (
              <div
                key={card.titulo}
                className={`group p-4 lg:p-6 bg-white rounded-2xl lg:rounded-3xl border border-stone-100 shadow-md hover:shadow-2xl hover:border-primary/50 hover:-translate-y-1.5 transition-all duration-300 active:scale-95 cursor-default flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-3 lg:gap-4 ${
                  index === tarjetas.length - 1 && tarjetas.length % 2 !== 0
                    ? 'col-span-2 lg:col-span-1'
                    : ''
                } ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-110 transition-transform">
                  <IconComponent className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-fraunces text-sm lg:text-lg font-bold text-stone-900 leading-tight">
                    {card.titulo}
                  </h3>
                  <p className="text-xs lg:text-sm text-stone-600 mt-1 lg:mt-1.5 leading-relaxed">
                    {card.descripcion}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* ═══ BANNER MOTOTAXI DESTACADO ═══ */}
      <div
        ref={bannerRef}
        className="relative w-full h-[400px] md:h-[450px] mt-16 md:mt-24 overflow-hidden"
      >
        {/* Imagen con parallax */}
        <div
          className="absolute inset-0 w-full h-[120%] -top-[10%]"
          style={{ transform: `translateY(${bannerOffset}px)` }}
        >
          <Image
            src={mototaxiImagen}
            alt="Familia viajando en moto-taxi tradicional en Homún, Yucatán"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        </div>

        {/* Overlay gradiente desde abajo (móviles) y desde la izquierda (desktop) */}
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-stone-900/95 via-stone-900/70 md:via-stone-900/50 to-transparent z-10" />

        {/* Texto encima */}
        <div className="relative z-20 h-full flex flex-col justify-end md:justify-center px-6 pr-24 md:px-16 lg:px-24 pb-8 md:pb-0 max-w-2xl">
          <h3 className="font-fraunces text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl">
            {mototaxiTitulo}
          </h3>
          <p className="text-white/95 mt-3 md:mt-4 text-sm md:text-lg leading-relaxed font-light drop-shadow-lg">
            {mototaxiDescripcion}
          </p>
        </div>
      </div>
    </section>
  );
}
