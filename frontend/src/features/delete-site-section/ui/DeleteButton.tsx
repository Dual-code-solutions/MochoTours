'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteSection } from '@/entities/site-content';
import { Button } from '@/shared/ui/button';

type Props = {
  seccionId: string;
  onDeleted: (seccionId: string) => void;
};

export function DeleteButton({ seccionId, onDeleted }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      '¿Está completamente seguro que desea borrar esta sección? Sus contenidos y la fotografía vinculada se perderán.'
    );

    if (!isConfirmed) return;

    try {
      setIsDeleting(true);
      await deleteSection(seccionId);
      toast.success('Sección eliminada exitosamente');
      onDeleted(seccionId);
    } catch (error) {
      console.error(error);
      toast.error('No se pudo borrar la sección. Intente de nuevo.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button 
      variant="ghost" 
      onClick={handleDelete} 
      disabled={isDeleting}
      className="text-stone-400 hover:text-red-600 hover:bg-red-50 p-2 h-auto"
      title="Eliminar contenido completamente"
    >
      {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
    </Button>
  );
}
