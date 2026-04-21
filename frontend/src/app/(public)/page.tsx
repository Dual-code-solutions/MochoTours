import { HeroSection } from '@/widgets/hero-section';
import { AboutGuide } from '@/widgets/about-guide';
import { ExperienceInfo } from '@/widgets/experience-info';
import { GalleryPreview } from '@/widgets/gallery-preview';
import { LocationMap } from '@/widgets/location-map';
import { ContactFooter } from '@/widgets/contact-footer';
import { FALLBACK_DATA } from '@/shared/config/public-data';
import { getContactInfoISR } from '@/shared/api/getContactInfo';

export const revalidate = 300;

export const metadata = {
  title: 'Cenotes Homún Yucatán | Tours, Ubicación y Reservaciones | Mochótours',
  description: 'Vive la aventura en los cenotes de Homún, Yucatán. Tours guiados con más de 10 años de experiencia, ubicación a 1 hora de Mérida. Reservaciones por WhatsApp. Abierto todos los días.',
};

export default async function HomePage() {
  const contactInfo = await getContactInfoISR();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'TouristAttraction'],
    name: FALLBACK_DATA.identidad.nombre_negocio,
    description: 'Tours guiados por los cenotes más impresionantes de Homún, Yucatán. Experiencia auténtica en moto-taxi maya con guía local bilingüe.',
    url: 'https://cenotesaventuraymas.com',
    telephone: `+${FALLBACK_DATA.contacto.telefono_whatsapp_principal}`,
    image: '/cenote-aventura-homun.png',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: FALLBACK_DATA.ubicacion.direccion,
      addressLocality: 'Homún',
      addressRegion: 'Yucatán',
      postalCode: '97580',
      addressCountry: 'MX',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 20.7397,
      longitude: -89.2828,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.6',
      reviewCount: '11',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    sameAs: [
      'https://www.facebook.com/share/18C6QNCUUg/',
      'https://instagram.com/mochotours', // ⚠️ PLACEHOLDER
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div id="inicio" className="w-full">
         <HeroSection />
      </div>

      <section id="sobre-mi">
        <AboutGuide />
      </section>

      <section id="experiencia">
        <ExperienceInfo />
      </section>

      <section id="galeria">
        <GalleryPreview />
      </section>

      <section id="ubicacion">
        <LocationMap contactInfo={contactInfo} />
      </section>

      <div id="contacto">
        <ContactFooter contactInfo={contactInfo} />
      </div>
    </>
  );
}
