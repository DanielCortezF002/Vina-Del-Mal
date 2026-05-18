'use client';

import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, Package, AlertTriangle, Clock } from 'lucide-react';
import Image from 'next/image';
import {
  MOCK_SALES_DAILY, MOCK_SALES_WEEKLY, MOCK_SALES_MONTHLY,
  MOCK_TOP_PRODUCTS, MOCK_PENDING_ORDERS,
} from '@/data/mockData';

type Period = 'diario' | 'semanal' | 'mensual';

const DATA_MAP = {
  diario: MOCK_SALES_DAILY,
  semanal: MOCK_SALES_WEEKLY,
  mensual: MOCK_SALES_MONTHLY,
};

function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string; sub: string;
  icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-vdm-surface border border-white/5 rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon size={22} />
        </div>
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-vdm-text-muted text-sm">{label}</p>
      <p className="text-xs text-vdm-text-muted/60 mt-1">{sub}</p>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { color: string; name: string; value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-vdm-surface border border-white/10 rounded-xl p-3 text-sm shadow-xl">
      <p className="text-vdm-text-muted mb-2 font-medium">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: {entry.name === 'ventas'
            ? `$${Number(entry.value).toLocaleString('es-CL')}`
            : entry.value}
        </p>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const [period, setPeriod] = useState<Period>('diario');
  const data = DATA_MAP[period];

  const totalVentas = data.reduce((s, d) => s + d.ventas, 0);
  const totalOrdenes = data.reduce((s, d) => s + d.ordenes, 0);

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Ventas" value={`$${(totalVentas / 1000).toFixed(0)}K`} sub={`Período ${period}`} icon={TrendingUp} color="bg-vdm-primary/20 text-vdm-primary" />
        <StatCard label="Órdenes" value={String(totalOrdenes)} sub={`Período ${period}`} icon={Package} color="bg-blue-500/20 text-blue-400" />
        <StatCard label="Pendientes" value={String(MOCK_PENDING_ORDERS.length)} sub="Requieren despacho" icon={Clock} color="bg-yellow-500/20 text-yellow-400" />
        <StatCard label="Stock Bajo" value="5" sub="Productos bajo mínimo" icon={AlertTriangle} color="bg-red-500/20 text-red-400" />
      </div>

      {/* Sales Chart */}
      <div className="bg-vdm-surface border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl text-white">Ventas</h2>
          <div className="flex bg-black/40 border border-white/10 rounded-xl p-1 gap-1">
            {(['diario', 'semanal', 'mensual'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${period === p ? 'bg-vdm-primary text-white' : 'text-vdm-text-muted hover:text-white'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="label" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fill: '#888', fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#888', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={(v) => <span style={{ color: '#aaa', fontSize: 12 }}>{v}</span>} />
            <Line yAxisId="left" type="monotone" dataKey="ventas" stroke="#8B0000" strokeWidth={2.5} dot={{ fill: '#8B0000', r: 4 }} activeDot={{ r: 6 }} />
            <Line yAxisId="right" type="monotone" dataKey="ordenes" stroke="#D4AF37" strokeWidth={2} dot={{ fill: '#D4AF37', r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top 10 products */}
        <div className="bg-vdm-surface border border-white/5 rounded-2xl p-6">
          <h2 className="font-heading text-xl text-white mb-5">Top 10 Productos</h2>
          <div className="space-y-3">
            {MOCK_TOP_PRODUCTS.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="w-5 text-center text-xs text-vdm-text-muted font-bold">{i + 1}</span>
                <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-black/50 shrink-0">
                  <Image src={p.imageUrl} alt={p.name} fill sizes="36px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{p.name}</p>
                  <p className="text-xs text-vdm-text-muted">{p.unitsSold} unidades</p>
                </div>
                <span className="text-sm font-bold text-vdm-secondary shrink-0">
                  ${(p.revenue / 1000000).toFixed(1)}M
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending orders */}
        <div className="bg-vdm-surface border border-white/5 rounded-2xl p-6">
          <h2 className="font-heading text-xl text-white mb-5">Órdenes Pendientes</h2>
          <div className="space-y-3">
            {MOCK_PENDING_ORDERS.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5">
                <div>
                  <p className="text-sm font-medium text-white">{order.id}</p>
                  <p className="text-xs text-vdm-text-muted">{order.customerEmail} · {order.commune}</p>
                  <p className="text-xs text-vdm-text-muted">{order.itemCount} items</p>
                </div>
                <div className="text-right">
                  <p className="text-vdm-secondary font-bold">${order.total.toLocaleString('es-CL')}</p>
                  <button className="mt-1 text-xs px-2 py-1 rounded-lg bg-vdm-primary/20 text-vdm-primary border border-vdm-primary/30 hover:bg-vdm-primary hover:text-white transition-all">
                    Despachar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
