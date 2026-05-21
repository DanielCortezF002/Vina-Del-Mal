'use client';

import { useState, useMemo } from 'react';
import { Search, Users, ShoppingBag, TrendingUp, CalendarDays } from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  email: string;
  rut: string;
  totalOrders: number;
  totalSpent: number;
  lastPurchase: string;
  commune: string;
}

const MOCK_CUSTOMERS: Customer[] = [
  { id: 1, name: 'Carlos Muñoz', email: 'carlos@gmail.com', rut: '15.432.876-5', totalOrders: 12, totalSpent: 1_540_000, lastPurchase: '2026-05-18', commune: 'Providencia' },
  { id: 2, name: 'María González', email: 'maria@hotmail.com', rut: '18.765.432-1', totalOrders: 8, totalSpent: 890_000, lastPurchase: '2026-05-18', commune: 'Las Condes' },
  { id: 3, name: 'Pablo Soto', email: 'pablo@empresa.cl', rut: '12.345.678-9', totalOrders: 15, totalSpent: 2_180_000, lastPurchase: '2026-05-18', commune: 'Santiago' },
  { id: 4, name: 'Ana Fernández', email: 'ana@gmail.com', rut: '16.543.210-K', totalOrders: 6, totalSpent: 620_000, lastPurchase: '2026-05-17', commune: 'Ñuñoa' },
  { id: 5, name: 'Luis Araya', email: 'luis@gmail.com', rut: '14.876.543-2', totalOrders: 23, totalSpent: 3_450_000, lastPurchase: '2026-05-17', commune: 'Las Condes' },
  { id: 6, name: 'Sofía Reyes', email: 'sofia@outlook.com', rut: '19.234.567-8', totalOrders: 4, totalSpent: 312_000, lastPurchase: '2026-05-16', commune: 'Providencia' },
  { id: 7, name: 'Diego Castillo', email: 'diego@empresa.cl', rut: '17.654.321-0', totalOrders: 9, totalSpent: 1_120_000, lastPurchase: '2026-05-15', commune: 'Ñuñoa' },
  { id: 8, name: 'Valentina Rojas', email: 'valentina@gmail.com', rut: '20.123.456-7', totalOrders: 3, totalSpent: 478_000, lastPurchase: '2026-05-14', commune: 'Las Condes' },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function ClientesPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return MOCK_CUSTOMERS;
    const q = search.toLowerCase();
    return MOCK_CUSTOMERS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.rut.includes(q) ||
        c.commune.toLowerCase().includes(q),
    );
  }, [search]);

  const totalClientes = MOCK_CUSTOMERS.length;
  const totalGastado = MOCK_CUSTOMERS.reduce((s, c) => s + c.totalSpent, 0);
  const avgOrders = Math.round(
    MOCK_CUSTOMERS.reduce((s, c) => s + c.totalOrders, 0) / totalClientes,
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl text-white mb-1">Clientes</h1>
        <p className="text-vdm-text-muted text-sm">
          {totalClientes} clientes registrados
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-vdm-surface border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-vdm-primary" />
            <p className="text-vdm-text-muted text-xs">Total Clientes</p>
          </div>
          <p className="text-2xl font-bold text-white">{totalClientes}</p>
        </div>
        <div className="bg-vdm-surface border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-vdm-secondary" />
            <p className="text-vdm-text-muted text-xs">Ingresos de Clientes</p>
          </div>
          <p className="text-2xl font-bold text-vdm-secondary">
            ${(totalGastado / 1_000_000).toFixed(1)}M
          </p>
        </div>
        <div className="bg-vdm-surface border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag size={16} className="text-blue-400" />
            <p className="text-vdm-text-muted text-xs">Promedio Órdenes</p>
          </div>
          <p className="text-2xl font-bold text-blue-400">{avgOrders}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-vdm-text-muted"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, email, RUT o comuna..."
          className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-vdm-text-muted/40 focus:outline-none focus:border-vdm-primary/60 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-vdm-surface border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {[
                  'Cliente',
                  'Email',
                  'RUT',
                  'Comuna',
                  'Órdenes',
                  'Total Gastado',
                  'Última Compra',
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-vdm-text-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-white">{c.name}</p>
                  </td>
                  <td className="px-4 py-3 text-vdm-text-muted">{c.email}</td>
                  <td className="px-4 py-3 font-mono text-vdm-text-muted text-xs">
                    {c.rut}
                  </td>
                  <td className="px-4 py-3 text-vdm-text-muted">{c.commune}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-white">
                      <ShoppingBag size={14} className="text-vdm-text-muted" />
                      {c.totalOrders}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-vdm-secondary">
                    ${c.totalSpent.toLocaleString('es-CL')}
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-xs text-vdm-text-muted">
                      <CalendarDays size={12} />
                      {formatDate(c.lastPurchase)}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-vdm-text-muted"
                  >
                    No se encontraron clientes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
