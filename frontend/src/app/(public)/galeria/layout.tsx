import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Galería | Fotos y Videos de Cenotes en Homún, Yucatán — Cenotes Aventura y Más',
  description: 'Explora fotos y videos reales de los cenotes en Homún, Yucatán. Descubre las aguas turquesas, cavernas milenarias y la aventura que te espera.',
};

export default function GaleriaLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": "Fotos y Videos de los Cenotes de Homún",
    "description": "Galería oficial de Cenotes Aventura y Más en Homún, Yucatán. Fotos y videos de las aguas turquesas, cavernas y experiencias en el cenote.",
    "url": "https://mochotours.com/galeria",
    "about": {
      "@type": "TouristAttraction",
      "name": "Cenotes Aventura y Más Homún",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Homún",
        "addressRegion": "Yucatán",
        "addressCountry": "MX"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {children}
    </>
  );
}
