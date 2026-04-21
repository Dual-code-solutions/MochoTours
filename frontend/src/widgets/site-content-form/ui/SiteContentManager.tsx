'use client';

import { useEffect, useState } from 'react';
import { getSiteContent, SiteContent, SiteSection } from '@/entities/site-content';
import { SectionForm } from '@/features/edit-site-section';
import { DeleteButton } from '@/features/delete-site-section';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { PlusCircle, Link as LinkIcon, TextSelect, ImageIcon, Edit3 } from 'lucide-react';
import { toast } from 'sonner';

// Claves maestras que la web espera por diseño (aseguramos que siempre se ofrezcan al administrador)
const BASE_SECTIONS = ['hero_banner', 'about_us', 'experience_mototaxi', 'location', 'footer'];

export function SiteContentManager() {
  const [contentMap, setContentMap] = useState<SiteContent>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // seccion seleccionada para edición
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newSectionKey, setNewSectionKey] = useState('');

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await getSiteContent();
      setContentMap(data || {});
    } catch (error) {
      console.error(error);
      toast.error('Ocurrió un problema cargando los datos actuales del servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateSuccess = (updated: SiteSection) => {
    setContentMap((prev) => ({ ...prev, [updated.seccion]: updated }));
    setEditingKey(null);
    setIsCreatingNew(false);
    setNewSectionKey('');
  };

  const handleDeleteSuccess = (seccionKey: string) => {
    setContentMap((prev) => {
      const clone = { ...prev };
      delete clone[seccionKey];
      return clone;
    });
  };

  // Prepara una lista consolidada: Base sections + any custom sections from DB
  const dynamicKeys = Object.keys(contentMap).filter((k) => !BASE_SECTIONS.includes(k));
  const allSectionsToDisplay = [...BASE_SECTIONS, ...dynamicKeys];

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start pb-10">
      
      {/* ── Lista Izquierda (Tarjetas) ────────────────────────── */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-5 flex flex-col gap-3">
               <Skeleton className="h-4 w-3/4 rounded-full" />
               <Skeleton className="h-3 w-full rounded-full" />
               <Skeleton className="h-3 w-1/2 rounded-full" />
            </Card>
          ))
        ) : (
          <>
            {allSectionsToDisplay.map((secKey) => {
              const data = contentMap[secKey];
              const isEditing = editingKey === secKey;
              
              return (
                <div 
                  key={secKey} 
                  className={`
                    relative group transition-all duration-200 overflow-hidden rounded-xl border
                    ${isEditing ? 'border-primary ring-2 ring-primary/20 shadow-md bg-stone-50' : 'border-stone-200 hover:border-primary/50 bg-white hover:shadow-sm'}
                  `}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 text-xs font-semibold text-stone-500 mb-2 font-mono">
                          <LinkIcon className="h-3 w-3" /> /{secKey}
                        </span>
                        <h4 className="font-bold text-stone-800 text-lg leading-tight mb-1">
                          {data?.titulo || <span className="text-stone-300 italic">Sin Título</span>}
                        </h4>
                        
                        {/* Indicadores visuales */}
                        <div className="flex gap-4 mt-3 text-sm text-stone-500">
                          {data?.descripcion ? (
                            <span className="flex items-center gap-1.5"><TextSelect className="h-4 w-4" /> Texto</span>
                          ) : (
                            <span className="flex items-center gap-1.5 opacity-40 line-through"><TextSelect className="h-4 w-4" /> Texto</span>
                          )}
                          {data?.imagenUrl ? (
                            <span className="flex items-center gap-1.5 text-primary"><ImageIcon className="h-4 w-4" /> Imagen</span>
                          ) : (
                            <span className="flex items-center gap-1.5 opacity-40 line-through"><ImageIcon className="h-4 w-4" /> Imagen</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center gap-2">
                        <Button 
                          variant={isEditing ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                             setEditingKey(isEditing ? null : secKey);
                             setIsCreatingNew(false);
                          }}
                        >
                          {isEditing ? 'Editando' : <><Edit3 className="h-4 w-4 lg:mr-2" /> <span className="hidden lg:block">Editar</span></>}
                        </Button>

                        {data && !BASE_SECTIONS.includes(secKey) && (
                          <DeleteButton seccionId={secKey} onDeleted={handleDeleteSuccess} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Nueva Sección Custom */}
            {isCreatingNew ? (
              <div className="p-5 border-2 border-dashed border-primary rounded-xl bg-primary/5 text-center">
                 <p className="text-sm text-primary font-medium mb-3">Defina la clave (URL) de su bloque</p>
                 <input 
                   type="text" 
                   value={newSectionKey}
                   onChange={e => setNewSectionKey(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                   placeholder="ej_ seccion_extra"
                   className="w-full text-center p-2 rounded border border-stone-200 focus:outline-primary mb-3 bg-white"
                   autoFocus
                 />
                 <Button 
                   size="sm" 
                   className="w-full"
                   disabled={newSectionKey.length < 3}
                   onClick={() => {
                     setEditingKey(newSectionKey);
                     setIsCreatingNew(false);
                   }}
                 >
                   Continuar Edición
                 </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => { setIsCreatingNew(true); setEditingKey(null); }}
                className="w-full py-8 text-stone-500 hover:text-primary hover:border-primary border-2 border-dashed border-stone-200 bg-white"
              >
                <PlusCircle className="mr-2 h-5 w-5" /> Agregar Componente Dinámico Extra
              </Button>
            )}
          </>
        )}
      </div>

      {/* ── Área Derecha (Formulario Activo) ───────────────────────── */}
      <div className="w-full lg:w-2/3">
        {editingKey ? (
           <Card className="p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 shadow-xl border-t-4 border-t-primary rounded-2xl">
             <div className="mb-6 pb-6 border-b border-stone-100 flex items-center justify-between">
               <div>
                 <h3 className="text-2xl font-bold text-stone-dark font-fraunces">Editando Contenido Vital</h3>
                 <p className="text-stone-500 mt-1">Los cambios se guardan localmente para el identificador en código: <strong className="font-mono bg-stone-100 px-2 py-0.5 rounded text-primary text-sm">{editingKey}</strong></p>
               </div>
             </div>
             
             {/* Renderizamos el formulario delegándole la sección */}
             <SectionForm 
               key={editingKey} // Forzamos remounting si la key cambia
               seccionId={editingKey} 
               seccionActual={contentMap[editingKey]} 
               onSuccess={handleUpdateSuccess} 
             />
           </Card>
        ) : (
           <div className="hidden lg:flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-stone-200 rounded-2xl bg-stone-50/50 min-h-[400px]">
             <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm text-stone-400 mb-4">
               <TextSelect className="h-8 w-8" />
             </div>
             <h3 className="text-xl font-bold text-stone-400">Panel de Escritura Cerrado</h3>
             <p className="max-w-sm mt-2 text-stone-500">
               Seleccione "Editar" en cualquiera de las divisiones de su izquierda para acceder al editor y alterar los textos o fotografías públicas.
             </p>
           </div>
        )}
      </div>
    </div>
  );
}
