'use client';

import { useState } from 'react';
import type { ContactInfo } from '../domain/entities/ContactInfo';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

interface ContactInfoFormProps {
  initialData?: ContactInfo | null;
  onSubmit: (data: ContactInfo) => Promise<void>;
  isLoading: boolean;
}

export function ContactInfoForm({ initialData, onSubmit, isLoading }: ContactInfoFormProps) {
  const [formData, setFormData] = useState<ContactInfo>({
    phonePrimary: initialData?.phonePrimary || '',
    phoneSecondary: initialData?.phoneSecondary || '',
    email: initialData?.email || '',
    googleMapsUrl: initialData?.googleMapsUrl || '',
    instagramUrl: initialData?.instagramUrl || '',
    facebookUrl: initialData?.facebookUrl || '',
    tiktokUrl: initialData?.tiktokUrl || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phonePrimary">Teléfono Principal (WhatsApp)</Label>
          <Input id="phonePrimary" name="phonePrimary" value={formData.phonePrimary} onChange={handleChange} placeholder="Ej: 9991200205" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneSecondary">Teléfono Secundario</Label>
          <Input id="phoneSecondary" name="phoneSecondary" value={formData.phoneSecondary} onChange={handleChange} placeholder="Ej: 9994166437" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="contacto@ejemplo.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="googleMapsUrl">URL Google Maps (Ubicación/Reseñas)</Label>
          <Input id="googleMapsUrl" name="googleMapsUrl" type="url" value={formData.googleMapsUrl} onChange={handleChange} placeholder="https://maps.app.goo.gl/..." />
        </div>
      </div>

      <div className="border-t border-stone-200 my-8 pt-8">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">Redes Sociales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="facebookUrl">URL Facebook</Label>
            <Input id="facebookUrl" name="facebookUrl" type="url" value={formData.facebookUrl} onChange={handleChange} placeholder="https://facebook.com/..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagramUrl">URL Instagram</Label>
            <Input id="instagramUrl" name="instagramUrl" type="url" value={formData.instagramUrl} onChange={handleChange} placeholder="https://instagram.com/..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tiktokUrl">URL TikTok</Label>
            <Input id="tiktokUrl" name="tiktokUrl" type="url" value={formData.tiktokUrl} onChange={handleChange} placeholder="https://tiktok.com/@..." />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-white min-w-[120px]">
          {isLoading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  );
}
