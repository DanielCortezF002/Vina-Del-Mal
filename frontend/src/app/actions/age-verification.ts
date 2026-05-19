'use server';

import { cookies } from 'next/headers';

/**
 * Server Action to set age verification cookie.
 * Called when user clicks "Soy mayor de 18" in the modal.
 * Sets HttpOnly cookie that middleware can read on every request.
 */
export async function verifyAge() {
  cookies().set('vdm_age_ok', '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 86400, // 24 hours
    path: '/',
  });
}
