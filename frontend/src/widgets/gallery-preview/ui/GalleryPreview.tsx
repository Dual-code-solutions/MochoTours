'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useShuffledGallery } from '@/features/shuffle-gallery/model/useShuffledGallery';
import { Button } from '@/shared/ui/button';
import { X, ChevronLeft, ChevronRight, Play, ImageIcon, Loader2 } from 'lucide-react';

export function GalleryPreview() {
  const { images, totalCount, isLoading } = useShuffledGallery();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Intersection Observer para stagger
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

  // Bloquear scroll cuando el lightbox está abierto
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [lightboxOpen]);

  // Navegación con teclado
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!lightboxOpen) return;
    if (e.key === 'Escape') setLightboxOpen(false);
    if (e.key === 'ArrowRight') setLightboxIndex((i) => (i + 1) % images.length);
    if (e.key === 'ArrowLeft') setLightboxIndex((i) => (i - 1 + images.length) % images.length);
  }, [lightboxOpen, images.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Configuración del Bento Grid Asimétrico para Desktop y Mobile Sizes
  // Configuración del Bento Grid Asimétrico (60% Hero, 40% Secondary)
  const getBentoClasses = (index: number) => {
    switch (index) {
      case 0:
        return 'lg:col-span-3 lg:row-span-2 min-h-[40vh] lg:min-h-[500px] h-[40vh] lg:h-full';
      case 1:
        return 'lg:col-span-2 lg:row-span-1 min-h-[35vh] lg:min-h-[240px] h-[35vh] lg:h-full';
      case 2:
        return 'lg:col-span-1 lg:row-span-1 min-h-[45vh] lg:min-h-[240px] h-[45vh] lg:h-full';
      case 3:
        return 'lg:col-span-1 lg:row-span-1 min-h-[30vh] lg:min-h-[240px] h-[30vh] lg:h-full';
      default:
        return 'min-h-[30vh] lg:min-h-[240px] h-[30vh] lg:h-full';
    }
  };

  return (
    <>
      <section ref={sectionRef} className="bg-[#FAF8F4] py-20 lg:py-32">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">

          {/* ═══ ENCABEZADO ═══ */}
          <div className="text-center mb-16">
            <span className="text-primary text-sm font-semibold tracking-[0.2em] uppercase">
              Galería
            </span>
            <h2 className="font-fraunces text-4xl lg:text-5xl font-bold text-stone-900 mt-3">
              La magia en imágenes
            </h2>
          </div>

          {/* ═══ GRID MASONRY ═══ */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="flex flex-col lg:grid lg:grid-cols-5 lg:grid-rows-2 gap-3 lg:gap-4">
              {images.map((img, index) => (
                <div
                  key={img.src + index}
                  className={`relative ${getBentoClasses(index)} rounded-2xl overflow-hidden shadow-[0px_12px_32px_-16px_rgba(0,0,0,0.18)] hover:shadow-[0px_24px_48px_-12px_rgba(0,0,0,0.28)] hover:scale-[1.02] cursor-zoom-in group transition-all duration-500 w-full ${
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-12'
                  }`}
                  style={{ transitionDelay: `${index * 120}ms` }}
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMTAiIGhlaWdodD0iMTEwIj48cmVjdCB3aWR0aD0iMTEwIiBoZWlnaHQ9IjExMCIgZmlsbD0iI2U1ZTVlNSIvPjwvc3ZnPg=="
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-[center_30%] transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Overlay cinemático con título del Cenote */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-end items-start text-left p-6">
                    <span className="text-white/80 text-[11px] font-semibold tracking-[0.1em] uppercase mb-1 drop-shadow-md translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                      HOMÚN · YUCATÁN
                    </span>
                    <p className="text-white font-medium text-[15px] tracking-wide translate-y-4 group-hover:translate-y-0 transition-transform duration-300 drop-shadow-md">
                      {img.alt || 'Cenotes y Naturaleza en Homún'}
                    </p>
                  </div>

                  {/* Firma / Borde de la marca */}
                  <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 group-hover:ring-primary/60 group-hover:ring-inset transition-all duration-300 z-20 pointer-events-none" />

                  {/* Ícono de play para videos */}
                  {img.isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                        <Play className="h-6 w-6 text-stone-900 ml-1" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ═══ BOTÓN INFERIOR ═══ */}
          <div className="flex justify-center mt-12 lg:mt-16">
            <Link href="/galeria">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 px-8 group h-14"
              >
                <ImageIcon className="mr-2 h-5 w-5" />
                Ver galería completa{totalCount > 0 ? ` (${totalCount === 1 ? '1 foto' : `${totalCount} fotos`})` : ''}
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* ═══ LIGHTBOX NATIVO ═══ */}
      {lightboxOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Botón cerrar */}
          <button
            className="absolute top-6 right-6 z-[110] text-white/80 hover:text-white transition-colors"
            onClick={() => setLightboxOpen(false)}
            aria-label="Cerrar lightbox"
          >
            <X className="h-8 w-8" />
          </button>

          {/* Flecha izquierda */}
          <button
            className="absolute left-4 md:left-8 z-[110] text-white/60 hover:text-white transition-colors p-2"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((i) => (i - 1 + images.length) % images.length);
            }}
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="h-10 w-10" />
          </button>

          {/* Imagen central */}
          <div
            className="relative w-[90vw] h-[80vh] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].alt}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Flecha derecha */}
          <button
            className="absolute right-4 md:right-8 z-[110] text-white/60 hover:text-white transition-colors p-2"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((i) => (i + 1) % images.length);
            }}
            aria-label="Imagen siguiente"
          >
            <ChevronRight className="h-10 w-10" />
          </button>

          {/* Contador */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm tracking-wider z-[110]">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
