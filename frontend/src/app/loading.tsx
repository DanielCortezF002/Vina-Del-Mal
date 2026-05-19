export default function Loading() {
  return (
    <div className="min-h-screen bg-vdm-dark flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-vdm-primary/30 border-t-vdm-primary rounded-full animate-spin" />
        <p className="text-vdm-text-muted text-sm animate-pulse">Cargando...</p>
      </div>
    </div>
  );
}
