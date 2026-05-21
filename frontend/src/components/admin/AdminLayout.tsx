'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingCart,
  Users,
  LogOut,
  Wine,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/productos', label: 'Productos', icon: Package },
  { href: '/admin/inventario', label: 'Inventario', icon: Warehouse },
  { href: '/admin/ventas', label: 'Ventas', icon: ShoppingCart },
  { href: '/admin/clientes', label: 'Clientes', icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Rehydrate Zustand store from localStorage
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [hydrated, isAuthenticated, pathname, router]);

  // Show login page without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Loading state while hydrating
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-vdm-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="w-8 h-8 border-2 border-vdm-primary/30 border-t-vdm-primary rounded-full animate-spin" />
          <p className="text-vdm-text-muted text-sm">Cargando panel...</p>
        </div>
      </div>
    );
  }

  // Not authenticated — redirect is happening
  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    // Eliminar cookie de auth
    document.cookie = 'vdm_auth_token=; path=/; max-age=0';
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-vdm-dark flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-black/50 border-r border-white/5 flex flex-col">
        <div className="px-5 py-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Wine size={16} className="text-vdm-primary" />
            <span className="font-heading text-vdm-secondary text-sm tracking-wider">
              Admin Panel
            </span>
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
                  : 'text-vdm-text-muted hover:bg-white/5 hover:text-white',
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        {/* User info & logout */}
        <div className="px-4 py-4 border-t border-white/5 space-y-3">
          {user && (
            <div className="px-1">
              <p className="text-xs text-white font-medium truncate">{user.fullName}</p>
              <p className="text-xs text-vdm-text-muted/60 truncate">{user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-vdm-text-muted hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
          <p className="text-xs text-vdm-text-muted/40 px-1">Viña del Mal v1.0</p>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
