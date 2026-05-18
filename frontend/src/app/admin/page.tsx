import AdminDashboard from '@/components/admin/AdminDashboard';

export default function AdminPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl text-white mb-1">Dashboard</h1>
        <p className="text-vdm-text-muted text-sm">Resumen de ventas y operaciones</p>
      </div>
      <AdminDashboard />
    </div>
  );
}
