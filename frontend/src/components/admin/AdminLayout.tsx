'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Warehouse, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/productos', label: 'Productos', icon: Package },
  { href: '/admin/inventario', label: 'Inventario', icon: Warehouse },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-vdm-dark flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-black/50 border-r border-white/5 flex flex-col">
        <div className="px-5 py-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-vdm-primary" />
            <span className="font-heading text-vdm-secondary text-sm tracking-wider">Admin Panel</span>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                pathname === href
                  ? 'bg-vdm-primary/20 text-vdm-primary border border-vdm-primary/30'
                  : 'text-vdm-text-muted hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-white/5">
          <p className="text-xs text-vdm-text-muted/60">Viña del Mal v1.0</p>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
