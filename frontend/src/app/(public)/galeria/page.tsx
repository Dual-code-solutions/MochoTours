'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getGallery } from '@/entities/media/api/mediaApi';
import { Media, Meta } from '@/entities/media/model/types';
import { FALLBACK_DATA } from '@/shared/config/public-data';
import { Button } from '@/shared/ui/button';
import {
  X, ChevronLeft, ChevronRight, Play, Loader2,
  ImageIcon, Film, LayoutGrid, ArrowLeft,
} from 'lucide-react';

type FilterType = 'todo' | 'imagen' | 'video';

type DisplayImage = {
  src: string;
  alt: string;
  tipo: 'imagen' | 'video';
};

export default function GaleriaPage() {
  const [items, setItems] = useState<DisplayImage[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [filter, setFilter] = useState<FilterType>('todo');
  const [usingFallback, setUsingFallback] = useState(false);

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const gridEndRef = useRef<HTMLDivElement>(null);

  // ─── Carga inicial ───
  useEffect(() => {
    const MIN_ITEMS = 6; // Mínimo de fotos para que la galería no se vea vacía

    const loadInitial = async () => {
      try {
        const res = await getGallery({ page: 1, limit: 12 });
        const data = res.data;

        if (data && data.length > 0) {
          const mapped = mapMedia(data);

          if (mapped.length < MIN_ITEMS) {
            // Pocas fotos en BD → completar con locales
            const localExtras = FALLBACK_DATA.galeriaPreview
              .filter((local) => !mapped.some((m) => m.src === local.src))
              .map((f) => ({ src: f.src, alt: f.alt, tipo: 'imagen' as const }));
            setItems([...mapped, ...localExtras.slice(0, MIN_ITEMS - mapped.length)]);
          } else {
            setItems(mapped);
          }

          setMeta(res.meta || null);
        } else {
          useFallback();
        }
      } catch {
        useFallback();
      } finally {
        setIsLoading(false);
      }
    };

    const useFallback = () => {
      setItems(
        FALLBACK_DATA.galeriaPreview.map((f) => ({
          src: f.src,
          alt: f.alt,
          tipo: 'imagen' as const,
        }))
      );
      setUsingFallback(true);
    };

    loadInitial();
  }, []);

  // ─── Cargar más ───
  const loadMore = async () => {
    if (!meta?.hasNext || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await getGallery({ page: nextPage, limit: 12 });
      setItems((prev) => [...prev, ...mapMedia(res.data)]);
      setMeta(res.meta || null);
      setPage(nextPage);

      // Scroll suave al final
      setTimeout(() => {
        gridEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    } catch {
      // silencioso
    } finally {
      setIsLoadingMore(false);
    }
  };

  // ─── Helper mapper ───
  function mapMedia(data: Media[]): DisplayImage[] {
    return data.map((item) => ({
      src: item.urlMedia || '',
      alt: item.titulo || 'Cenote en Homún, Yucatán — Mochótours',
      tipo: item.tipo,
    }));
  }

  // ─── Filtrado en cliente ───
  const filteredItems =
    filter === 'todo'
      ? items
      : items.filter((item) => item.tipo === filter);

  // ─── Lightbox keyboard nav ───
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight')
        setLightboxIndex((i) => (i + 1) % filteredItems.length);
      if (e.key === 'ArrowLeft')
        setLightboxIndex((i) => (i - 1 + filteredItems.length) % filteredItems.length);
    },
    [lightboxOpen, filteredItems.length]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Bloquear scroll con lightbox abierto
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [lightboxOpen]);

  // ─── Tabs de filtro ───
  const filters: { key: FilterType; label: string; icon: React.ElementType }[] = [
    { key: 'todo', label: 'Todo', icon: LayoutGrid },
    { key: 'imagen', label: 'Fotos', icon: ImageIcon },
    { key: 'video', label: 'Videos', icon: Film },
  ];

  // Masonry heights pattern
  const heightPattern = [
    'h-56 md:h-72', 'h-48 md:h-64', 'h-64 md:h-80', 'h-52 md:h-68',
    'h-60 md:h-76', 'h-48 md:h-64', 'h-56 md:h-72', 'h-64 md:h-80',
    'h-52 md:h-68', 'h-56 md:h-72', 'h-48 md:h-64', 'h-60 md:h-76',
  ];

  return (
    <>
      <div className="min-h-screen bg-stone-50 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">

          {/* ═══ BOTÓN VOLVER ═══ */}
          <Link
            href="/"
            className="inline-flex items-center text-stone-500 hover:text-primary transition-colors mb-8 text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Link>

          {/* ═══ ENCABEZADO ═══ */}
          <div className="mb-12">
            <span className="text-primary text-sm font-semibold tracking-[0.2em] uppercase">
              Nuestro Álbum
            </span>
            <h1 className="font-fraunces text-4xl md:text-5xl font-bold text-stone-900 mt-2">
              Galería completa
            </h1>
            <p className="text-stone-600 mt-3 text-lg font-light">
              {meta?.total || items.length} fotos y videos de los tours en los cenotes de Homún
            </p>
          </div>

          {/* ═══ TABS DE FILTRO ═══ */}
          <div className="flex gap-2 sm:gap-3 mb-10">
            {filters.map((f) => {
              const Icon = f.icon;
              const isActive = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* ═══ LOADING STATE ═══ */}
          {isLoading ? (
            <div className="flex justify-center py-32">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-32 text-stone-400">
              <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No hay {filter === 'video' ? 'videos' : 'fotos'} disponibles aún.</p>
            </div>
          ) : (
            <>
              {/* ═══ GRID MASONRY ═══ */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {filteredItems.map((img, index) => (
                  <div
                    key={img.src + index}
                    className={`relative ${heightPattern[index % heightPattern.length]} rounded-xl overflow-hidden shadow-md cursor-pointer group transition-all duration-300 animate-in fade-in slide-in-from-bottom-4`}
                    style={{ animationDelay: `${(index % 12) * 50}ms`, animationFillMode: 'backwards' }}
                    onClick={() => {
                      setLightboxIndex(index);
                      setLightboxOpen(true);
                    }}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10" />

                    {img.tipo === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                          <Play className="h-6 w-6 text-stone-900 ml-1" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div ref={gridEndRef} />

              {/* ═══ BOTÓN CARGAR MÁS ═══ */}
              {!usingFallback && meta?.hasNext && (
                <div className="flex justify-center mt-12">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className="rounded-full border-stone-300 text-stone-700 hover:bg-primary hover:text-white hover:border-primary transition-all px-8"
                  >
                    {isLoadingMore ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LayoutGrid className="mr-2 h-4 w-4" />
                    )}
                    {isLoadingMore ? 'Cargando más...' : 'Cargar más fotos'}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ═══ LIGHTBOX ═══ */}
      {lightboxOpen && filteredItems.length > 0 && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-6 right-6 z-[110] text-white/80 hover:text-white"
            onClick={() => setLightboxOpen(false)}
            aria-label="Cerrar"
          >
            <X className="h-8 w-8" />
          </button>

          <button
            className="absolute left-4 md:left-8 z-[110] text-white/60 hover:text-white p-2"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((i) => (i - 1 + filteredItems.length) % filteredItems.length);
            }}
            aria-label="Anterior"
          >
            <ChevronLeft className="h-10 w-10" />
          </button>

          <div
            className="relative w-[90vw] h-[80vh] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={filteredItems[lightboxIndex].src}
              alt={filteredItems[lightboxIndex].alt}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          </div>

          <button
            className="absolute right-4 md:right-8 z-[110] text-white/60 hover:text-white p-2"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((i) => (i + 1) % filteredItems.length);
            }}
            aria-label="Siguiente"
          >
            <ChevronRight className="h-10 w-10" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm tracking-wider z-[110]">
            {lightboxIndex + 1} / {filteredItems.length}
          </div>
        </div>
      )}
    </>
  );
}
