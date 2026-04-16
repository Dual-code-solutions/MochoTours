/**
 * Página del Dashboard — /admin
 * Se construirá completamente en el Paso 5.
 * Este placeholder verifica que el AuthGuard funciona.
 */
export default function AdminDashboardPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-cream">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Panel de Administración
        </h1>
        <p className="text-stone-text">
          ✅ AuthGuard funcionando — estás autenticado
        </p>
      </div>
    </main>
  );
}
