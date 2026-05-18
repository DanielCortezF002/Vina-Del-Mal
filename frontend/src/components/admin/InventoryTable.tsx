'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, ArrowDown, ArrowUp, RefreshCw, X } from 'lucide-react';
import { stockAdjustSchema, type StockAdjustData } from '@/types/sprint2';
import { MOCK_STOCK, MOCK_MOVEMENTS } from '@/data/mockData';
import { cn } from '@/lib/utils';

const TYPE_CONFIG = {
  entrada: { color: 'text-green-400 bg-green-400/10 border-green-400/30', icon: ArrowUp, label: 'Entrada' },
  salida: { color: 'text-red-400 bg-red-400/10 border-red-400/30', icon: ArrowDown, label: 'Salida' },
  ajuste: { color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30', icon: RefreshCw, label: 'Ajuste' },
};

function AdjustModal({ productId, productName, onClose }: {
  productId: number; productName: string; onClose: () => void;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<StockAdjustData>({
    resolver: zodResolver(stockAdjustSchema),
    defaultValues: { productId, type: 'entrada' },
  });

  const onSubmit = (_data: StockAdjustData) => {
    // TODO: POST /api/v1/admin/stock/adjust when backend is ready
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-vdm-surface border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <h3 className="font-heading text-xl text-white">Ajustar Stock</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-vdm-text-muted">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <p className="text-sm text-vdm-text-muted">Producto: <span className="text-white">{productName}</span></p>
          <input type="hidden" {...register('productId', { valueAsNumber: true })} />

          <div>
            <label className="block text-xs text-vdm-text-muted mb-2">Tipo de movimiento</label>
            <div className="grid grid-cols-3 gap-2">
              {(['entrada', 'salida', 'ajuste'] as const).map((t) => (
                <label key={t} className="cursor-pointer">
                  <input type="radio" value={t} {...register('type')} className="sr-only" />
                  <div className={cn('text-center py-2 rounded-xl border text-xs font-medium transition-all', TYPE_CONFIG[t].color)}>
                    {TYPE_CONFIG[t].label}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-vdm-text-muted mb-1">Sucursal</label>
            <select {...register('branchId')} className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none">
              <option value="stgo-centro">Santiago Centro</option>
              <option value="providencia">Providencia</option>
              <option value="las-condes">Las Condes</option>
              <option value="nunoa">Ñuñoa</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-vdm-text-muted mb-1">Cantidad</label>
            <input {...register('quantity', { valueAsNumber: true })} type="number" min="1"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-vdm-primary/60" />
            {errors.quantity && <p className="text-red-400 text-xs mt-1">{errors.quantity.message}</p>}
          </div>

          <div>
            <label className="block text-xs text-vdm-text-muted mb-1">Motivo *</label>
            <input {...register('reason')} placeholder="Ej: Reposición proveedor, Orden ORD-001..."
              className={cn('w-full bg-black/40 border rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-vdm-primary/60', errors.reason ? 'border-red-500/60' : 'border-white/10')} />
            {errors.reason && <p className="text-red-400 text-xs mt-1">{errors.reason.message}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-vdm-text-muted text-sm hover:text-white transition-all">Cancelar</button>
            <button type="submit" className="flex-1 py-2.5 rounded-xl bg-vdm-primary text-white text-sm font-semibold hover:bg-vdm-accent transition-all">Registrar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function InventoryTable() {
  const [adjustTarget, setAdjustTarget] = useState<{ id: number; name: string } | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl text-white mb-1">Inventario</h1>
        <p className="text-vdm-text-muted text-sm">Gestión de stock por sucursal</p>
      </div>

      {/* Stock table */}
      <div className="bg-vdm-surface border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-400" />
          <span className="text-sm font-medium text-white">Stock actual por sucursal</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Producto', 'Sucursal', 'Stock actual', 'Mínimo', 'Estado', 'Último mov.', 'Acción'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-vdm-text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_STOCK.map((item) => {
                const isLow = item.currentStock <= item.minStockAlert;
                const isEmpty = item.currentStock === 0;
                return (
                  <tr key={`${item.productId}-${item.branch}`} className="border-b border-white/5 hover:bg-white/2">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-black/50 shrink-0">
                          <Image src={item.imageUrl} alt={item.productName} fill sizes="36px" className="object-cover" />
                        </div>
                        <span className="font-medium text-white text-sm">{item.productName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-vdm-text-muted">{item.branch}</td>
                    <td className="px-4 py-3">
                      <span className={cn('text-2xl font-bold', isEmpty ? 'text-red-400' : isLow ? 'text-yellow-400' : 'text-green-400')}>
                        {item.currentStock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-vdm-text-muted">{item.minStockAlert}</td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full border',
                        isEmpty ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                        isLow ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                        'bg-green-500/10 text-green-400 border-green-500/30')}>
                        {isEmpty ? '⛔ Sin stock' : isLow ? '⚠️ Stock bajo' : '✓ Normal'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-vdm-text-muted text-xs">{item.lastMovement}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setAdjustTarget({ id: item.productId, name: item.productName })}
                        className="px-3 py-1.5 rounded-lg text-xs bg-vdm-primary/10 text-vdm-primary border border-vdm-primary/30 hover:bg-vdm-primary hover:text-white transition-all"
                      >
                        Ajustar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Movement history */}
      <div className="bg-vdm-surface border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5">
          <span className="text-sm font-medium text-white">Historial de movimientos</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Tipo', 'Producto', 'Cantidad', 'Motivo', 'Sucursal', 'Operador', 'Fecha'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-vdm-text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_MOVEMENTS.map((mov) => {
                const cfg = TYPE_CONFIG[mov.type];
                const Icon = cfg.icon;
                return (
                  <tr key={mov.id} className="border-b border-white/5 hover:bg-white/2">
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border', cfg.color)}>
                        <Icon size={10} />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white">{mov.productName}</td>
                    <td className="px-4 py-3 font-bold text-white">{mov.quantity}</td>
                    <td className="px-4 py-3 text-vdm-text-muted max-w-xs truncate">{mov.reason}</td>
                    <td className="px-4 py-3 text-vdm-text-muted">{mov.branch}</td>
                    <td className="px-4 py-3 text-vdm-text-muted">{mov.operatorName}</td>
                    <td className="px-4 py-3 text-vdm-text-muted text-xs">{new Date(mov.createdAt).toLocaleString('es-CL')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {adjustTarget && (
        <AdjustModal
          productId={adjustTarget.id}
          productName={adjustTarget.name}
          onClose={() => setAdjustTarget(null)}
        />
      )}
    </div>
  );
}
