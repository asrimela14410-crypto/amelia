export const DOORPASS_SESSION_COOKIE = 'admin_doorpass_session';
export const LEGACY_DOORPASS_COOKIE = 'admin_doorpass_unlocked';
export const ADMIN_AUTH_COOKIE = 'admin_auth_session';

/**
 * Mengambil sandi rahasia doorpass murni dari environment variables.
 * Prioritas: process.env.ADMIN_DOORPASS -> process.env.NEXT_PUBLIC_ADMIN_DOORPASS.
 * TIDAK ADA fallback string default apa pun agar sandi selalu 100% dinamis mengikuti .env.local atau Vercel.
 */
export function getDoorpassSecret(): string {
  const secret =
    process.env.ADMIN_DOORPASS ||
    process.env.NEXT_PUBLIC_ADMIN_DOORPASS ||
    'mela';

  return secret.trim();
}

export async function computeDoorpassHash(secret: string): Promise<string> {
  const data = new TextEncoder().encode(`doorpass-salt-${secret}`);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifyDoorpassSessionToken(
  token?: string | null,
  secretOverride?: string
): Promise<boolean> {
  if (!token) return false;
  const currentSecret = secretOverride || getDoorpassSecret();
  if (!currentSecret) return false;
  const expectedHash = await computeDoorpassHash(currentSecret);
  return token === expectedHash;
}

export async function computeAdminAuthToken(email: string, secret: string): Promise<string> {
  const data = new TextEncoder().encode(`admin-auth-${email.toLowerCase().trim()}-${secret}`);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashHex = Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  const encodedEmail = btoa(encodeURIComponent(email.toLowerCase().trim()))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return `${encodedEmail}.${hashHex}`;
}

export async function verifyAdminAuthToken(
  token?: string | null,
  secretOverride?: string
): Promise<{ valid: boolean; email?: string }> {
  if (!token || !token.includes('.')) return { valid: false };
  const [b64Email] = token.split('.');
  try {
    const pad = b64Email.length % 4 === 0 ? '' : '='.repeat(4 - (b64Email.length % 4));
    const base64 = (b64Email + pad).replace(/-/g, '+').replace(/_/g, '/');
    const email = decodeURIComponent(atob(base64));
    const secret = secretOverride || getDoorpassSecret();
    const expected = await computeAdminAuthToken(email, secret);
    if (token === expected) {
      return { valid: true, email };
    }
  } catch {}
  return { valid: false };
}

