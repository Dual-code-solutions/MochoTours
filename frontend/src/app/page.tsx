export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 py-16">
      {/* Verificación de fuente heading (Fraunces) */}
      <h1 className="text-5xl lg:text-7xl font-bold text-primary text-center mb-4">
        Cenotes Aventura y Más
      </h1>

      {/* Verificación de fuente body (Inter) */}
      <p className="text-lg text-stone-text text-center max-w-2xl mb-8">
        Descubre los cenotes más impresionantes de Homún con un guía local.
        Tours en moto-taxi maya, agua cristalina y experiencia auténtica.
      </p>

      {/* Verificación de colores */}
      <div className="flex flex-wrap gap-4 justify-center mb-12">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-xl bg-primary" />
          <span className="text-sm text-stone-text">Turquesa</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-xl bg-terracotta" />
          <span className="text-sm text-stone-text">Terracota</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-xl bg-gold" />
          <span className="text-sm text-stone-text">Dorado</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-xl bg-whatsapp" />
          <span className="text-sm text-stone-text">WhatsApp</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-xl bg-destructive" />
          <span className="text-sm text-stone-text">Error</span>
        </div>
      </div>

      {/* Verificación de botones con colores del proyecto */}
      <div className="flex gap-4">
        <button className="px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary-hover transition-colors">
          Botón Primario
        </button>
        <button className="px-6 py-3 rounded-full bg-terracotta text-white font-medium hover:bg-terracotta-hover transition-colors">
          Botón Terracota
        </button>
      </div>

      <p className="mt-12 text-sm text-muted-foreground">
        ✅ Paso 0 completado — Proyecto configurado correctamente
      </p>
    </main>
  );
}
