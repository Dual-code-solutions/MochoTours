'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Trash2, Loader2, AlertCircle } from 'lucide-react';
import { deleteMedia } from '@/entities/media';

type Props = {
  mediaId: string;
  onDeleted: (mediaId: string) => void;
};

/**
 * Botón destructivo con doble confirmación integrada al vuelo
 */
export function DeleteMediaButton({ mediaId, onDeleted }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      'ALERTA CRÍTICA: ¿Está seguro que desea borrar permanentemente este archivo de su Galería? Se perderá irrevocablemente tanto en Base de Datos como en Nube Storage.'
    );

    if (!isConfirmed) return;

    try {
      setIsDeleting(true);
      await deleteMedia(mediaId);
      toast.success('El recurso ha sido incinerado de la Galería correctamente.');
      onDeleted(mediaId); // delegamos al parent para animar la disolución
    } catch (err) {
      console.error(err);
      toast.error('Ocurrió un error. El archivo podría estar protegido o corrompido en red.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-widest
        transition-all duration-200 backdrop-blur-sm
        ${isDeleting 
           ? 'bg-red-500/50 text-white/50 cursor-not-allowed' 
           : 'bg-red-500/80 hover:bg-red-600 text-white shadow-lg'
        }
      `}
      title="Eliminar permanentemente"
    >
      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      Eliminar
    </button>
  );
}
