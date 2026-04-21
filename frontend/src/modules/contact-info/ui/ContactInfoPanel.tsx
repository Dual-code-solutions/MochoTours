'use client';

import { useState, useEffect } from 'react';
import { ApiContactInfoRepository } from '../infrastructure/repositories/ApiContactInfoRepository';
import { GetContactInfo } from '../application/use-cases/GetContactInfo';
import { UpdateContactInfo } from '../application/use-cases/UpdateContactInfo';
import type { ContactInfo } from '../domain/entities/ContactInfo';
import { ContactInfoForm } from './ContactInfoForm';

export function ContactInfoPanel() {
  const [data, setData] = useState<ContactInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Hexagonal dependencies wire-up
  const repository = new ApiContactInfoRepository();
  const getContactInfoUseCase = new GetContactInfo(repository);
  const updateContactInfoUseCase = new UpdateContactInfo(repository);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getContactInfoUseCase.execute();
        setData(result);
      } catch (err) {
        console.error('Failed to load contact info:', err);
        setToastMessage({ type: 'error', text: 'Error al cargar la información de contacto' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async (formData: ContactInfo) => {
    setIsSaving(true);
    setToastMessage(null);
    try {
      const result = await updateContactInfoUseCase.execute(formData);
      setData(result);
      setToastMessage({ type: 'success', text: 'Cambios guardados correctamente.' });
    } catch (err) {
      console.error('Failed to update contact info:', err);
      setToastMessage({ type: 'error', text: 'Ocurrió un error al guardar los cambios.' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-stone-500">Cargando información...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 lg:p-8">
      <div className="mb-6 pb-6 border-b border-stone-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Información de Contacto</h2>
          <p className="text-stone-500 text-sm mt-1">Administra los teléfonos, correo y redes sociales que aparecen en la página pública.</p>
        </div>
      </div>

      {toastMessage && (
        <div className={`p-4 mb-6 rounded-xl border ${toastMessage.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {toastMessage.text}
        </div>
      )}

      <ContactInfoForm initialData={data} onSubmit={handleSave} isLoading={isSaving} />
    </div>
  );
}
