'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  Package,
  CalendarDays,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PendingOrder } from '@/types/sprint2';
import { MOCK_PENDING_ORDERS } from '@/data/mockData';

// Órdenes extendidas con más variedad de estados
const ALL_ORDERS: (PendingOrder & { status: string })[] = [
  ...MOCK_PENDING_ORDERS.map((o) => ({ ...o, status: 'pending' })),
  {
    id: 'ORD-2024-005',
    customerEmail: 'luis@gmail.com',
    total: 215000,
    itemCount: 1,
    createdAt: '2026-05-17T11:20:00Z',
    commune: 'Las Condes',
    status: 'paid',
  },
  {
    id: 'ORD-2024-006',
    customerEmail: 'sofia@outlook.com',
    total: 63000,
    itemCount: 2,
    createdAt: '2026-05-16T18:45:00Z',
    commune: 'Providencia',
    status: 'dispatched',
  },
  {
    id: 'ORD-2024-007',
    customerEmail: 'diego@empresa.cl',
    total: 38000,
    itemCount: 1,
    createdAt: '2026-05-15T10:30:00Z',
    commune: 'Ñuñoa',
    status: 'delivered',
  },
  {
    id: 'ORD-2024-008',
    customerEmail: 'camila@gmail.com',
    total: 72000,
    itemCount: 1,
    createdAt: '2026-05-14T20:15:00Z',
    commune: 'Santiago',
    status: 'delivered',
  },
  {
    id: 'ORD-2024-009',
    customerEmail: 'rodrigo@mail.cl',
    total: 18000,
    itemCount: 1,
    createdAt: '2026-05-13T13:00:00Z',
    commune: 'Maipú',
    status: 'cancelled',
  },
  {
    id: 'ORD-2024-010',
    customerEmail: 'valentina@gmail.com',
    total: 157000,
    itemCount: 3,
    createdAt: '2026-05-17T09:10:00Z',
    commune: 'Las Condes',
    status: 'paid',
  },
];

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: React.ElementType }
> = {
  pending: {
    label: 'Pendiente',
    color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    icon: Clock,
  },
  paid: {
    label: 'Pagado',
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    icon: CreditCard,
  },
  dispatched: {
    label: 'Despachado',
    color: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    icon: Truck,
  },
  delivered: {
    label: 'Entregado',
    color: 'bg-green-500/10 text-green-400 border-green-500/30',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Cancelado',
    color: 'bg-red-500/10 text-red-400 border-red-500/30',
    icon: XCircle,
  },
};

const STATUS_FILTERS = [
  { value: '', label: 'Todos' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'paid', label: 'Pagados' },
  { value: 'dispatched', label: 'Despachados' },
  { value: 'delivered', label: 'Entregados' },
  { value: 'cancelled', label: 'Cancelados' },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function VentasPage() {
  const [orders, setOrders] = useState(ALL_ORDERS);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let result = orders;
    if (statusFilter) result = result.filter((o) => o.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q) ||
          o.commune.toLowerCase().includes(q),
      );
    }
    return result;
  }, [orders, statusFilter, search]);

  const handleDispatch = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'dispatched' } : o)),
    );
  };

  // KPI rápidos
  const totalVentas = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((s, o) => s + o.total, 0);
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl text-white mb-1">Ventas y Órdenes</h1>
        <p className="text-vdm-text-muted text-sm">
          {orders.length} órdenes registradas
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-vdm-surface border border-white/5 rounded-2xl p-5">
          <p className="text-vdm-text-muted text-xs mb-1">Ingresos totales</p>
          <p className="text-2xl font-bold text-vdm-secondary">
            ${(totalVentas / 1000000).toFixed(1)}M
          </p>
        </div>
        <div className="bg-vdm-surface border border-white/5 rounded-2xl p-5">
          <p className="text-vdm-text-muted text-xs mb-1">Pendientes</p>
          <p className="text-2xl font-bold text-yellow-400">{pendingCount}</p>
        </div>
        <div className="bg-vdm-surface border border-white/5 rounded-2xl p-5">
          <p className="text-vdm-text-muted text-xs mb-1">Entregados</p>
          <p className="text-2xl font-bold text-green-400">{deliveredCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-vdm-text-muted"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por ID, email o comuna..."
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-vdm-text-muted/40 focus:outline-none focus:border-vdm-primary/60 transition-colors"
          />
        </div>
        <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-xl p-1">
          <Filter size={14} className="text-vdm-text-muted ml-2 mr-1" />
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                statusFilter === f.value
                  ? 'bg-vdm-primary text-white'
                  : 'text-vdm-text-muted hover:text-white',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-vdm-surface border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {[
                  'Orden',
                  'Cliente',
                  'Comuna',
                  'Items',
                  'Total',
                  'Fecha',
                  'Estado',
                  'Acciones',
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
              {filtered.map((order) => {
                const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                const StatusIcon = statusCfg.icon;
                return (
                  <tr
                    key={order.id}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-white font-medium">
                        {order.id}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-vdm-text-muted">
                      {order.customerEmail}
                    </td>
                    <td className="px-4 py-3 text-vdm-text-muted">{order.commune}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-vdm-text-muted">
                        <Package size={14} />
                        {order.itemCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-vdm-secondary">
                      ${order.total.toLocaleString('es-CL')}
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-xs text-vdm-text-muted">
                        <CalendarDays size={12} />
                        {formatDate(order.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border',
                          statusCfg.color,
                        )}
                      >
                        <StatusIcon size={12} />
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {(order.status === 'pending' || order.status === 'paid') && (
                        <button
                          onClick={() => handleDispatch(order.id)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-vdm-primary/20 text-vdm-primary border border-vdm-primary/30 hover:bg-vdm-primary hover:text-white transition-all"
                        >
                          <Truck size={12} className="inline mr-1" />
                          Despachar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-vdm-text-muted"
                  >
                    No se encontraron órdenes
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
