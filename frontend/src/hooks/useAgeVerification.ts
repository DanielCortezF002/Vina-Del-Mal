// No necesita 'use client' — los hooks son funciones puras que se ejecutan
// en el contexto del componente que los usa. El boundary lo define el componente.

import { useState, useEffect, useCallback } from 'react';

// ── Constantes ────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'vdm_age_verified';
const TTL_MS = 24 * 60 * 60 * 1000; // 24 horas en ms

// ── Tipos públicos ────────────────────────────────────────────────────────────
interface StoredVerification {
  timestamp: number;
}

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

interface UseAgeVerificationReturn {
  status: VerificationStatus;
  verify: () => void;
  reject: () => void;
}

// ── Helpers (puras, sin side effects) ────────────────────────────────────────
function readStoredVerification(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;

    const { timestamp } = JSON.parse(raw) as StoredVerification;
    const isValid = Date.now() - timestamp < TTL_MS;

    if (!isValid) {
      localStorage.removeItem(STORAGE_KEY);
    }

    return isValid;
  } catch {
    // Dato corrupto: limpiamos y pedimos reverificación
    localStorage.removeItem(STORAGE_KEY);
    return false;
  }
}

function writeVerification(): void {
  const payload: StoredVerification = { timestamp: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useAgeVerification(): UseAgeVerificationReturn {
  // 'pending' mientras no podemos leer localStorage (hidratación SSR-safe)
  const [status, setStatus] = useState<VerificationStatus>('pending');

  useEffect(() => {
    // Este efecto solo corre en el cliente, post-hidratación
    const isAlreadyVerified = readStoredVerification();
    setStatus(isAlreadyVerified ? 'verified' : 'rejected');
  }, []);

  const verify = useCallback(() => {
    writeVerification();
    setStatus('verified');
  }, []);

  const reject = useCallback(() => {
    setStatus('rejected');
    window.location.replace('https://www.google.com');
  }, []);

  return { status, verify, reject };
}
