import { Metadata } from 'next';
import { ContactInfoPanel } from '@/modules/contact-info/ui/ContactInfoPanel';

export const metadata: Metadata = {
  title: 'Contacto | Admin Mochótours',
};

export default function AdminContactoPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-fraunces text-stone-900">
          Información de Contacto
        </h1>
        <p className="text-stone-500 mt-2">
          Gestiona los teléfonos, correo electrónico y redes sociales.
        </p>
      </div>

      <ContactInfoPanel />
    </div>
  );
}
