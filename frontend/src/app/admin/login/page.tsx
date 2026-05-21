'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, KeyRound, Wine, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { loginApi } from '@/lib/api/auth';
import { isApiAvailable } from '@/lib/api';

// Credenciales demo cuando el backend no está disponible
const DEMO_EMAIL = 'admin@vinadelmal.cl';
const DEMO_PASSWORD = 'Admin123!';

export default function AdminLoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Completa todos los campos');
      return;
    }

    setIsLoading(true);

    try {
      if (isApiAvailable()) {
        // Modo real: autenticar contra el backend
        const res = await loginApi(email, password);
        login(
          {
            id: res.user.id,
            email: res.user.email,
            fullName: res.user.full_name,
            isAdmin: true,
          },
          res.access_token,
        );

        // Guardar token en cookie para el middleware
        document.cookie = `vdm_auth_token=${res.access_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      } else {
        // Modo demo: credenciales hardcodeadas
        await new Promise((r) => setTimeout(r, 800));

        if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
          throw new Error('Credenciales incorrectas');
        }

        const demoToken = 'demo_token_' + Date.now();
        login(
          {
            id: 'demo-1',
            email: DEMO_EMAIL,
            fullName: 'Administrador VdM',
            isAdmin: true,
          },
          demoToken,
        );

        document.cookie = `vdm_auth_token=${demoToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      }

      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de autenticación');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-vdm-dark flex items-center justify-center p-4">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(139,0,0,0.15),_transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-vdm-surface border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-10 pb-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 rounded-2xl bg-vdm-primary/20 border border-vdm-primary/30 flex items-center justify-center mx-auto mb-5"
            >
              <Wine size={28} className="text-vdm-primary" />
            </motion.div>
            <h1 className="font-heading text-2xl text-white mb-1">
              Panel Administrativo
            </h1>
            <p className="text-vdm-text-muted text-sm">
              Viña del Mal · Acceso restringido
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
              >
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-vdm-text-muted mb-2">
                <Mail size={14} className="inline mr-1.5" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vinadelmal.cl"
                autoComplete="email"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-vdm-text-muted/40 focus:outline-none focus:border-vdm-primary/60 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-vdm-text-muted mb-2">
                <KeyRound size={14} className="inline mr-1.5" />
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-vdm-text-muted/40 focus:outline-none focus:border-vdm-primary/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-vdm-text-muted hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-vdm-primary text-white font-semibold hover:bg-vdm-accent transition-all duration-300 hover:shadow-[0_0_25px_rgba(139,0,0,0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <Lock size={18} />
                  Iniciar Sesión
                </>
              )}
            </button>

            {/* Demo hint */}
            {!isApiAvailable() && (
              <div className="text-center pt-2">
                <p className="text-xs text-vdm-text-muted/60">
                  Modo demo · Credenciales:{' '}
                  <span className="text-vdm-text-muted">admin@vinadelmal.cl</span>
                  {' / '}
                  <span className="text-vdm-text-muted">Admin123!</span>
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-vdm-text-muted/40 mt-6">
          © 2026 Viña del Mal · Todos los derechos reservados
        </p>
      </motion.div>
    </div>
  );
}
