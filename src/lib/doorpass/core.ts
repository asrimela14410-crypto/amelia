export const DOORPASS_SESSION_COOKIE = 'admin_doorpass_session';
export const LEGACY_DOORPASS_COOKIE = 'admin_doorpass_unlocked';

/**
 * Mengambil sandi rahasia doorpass murni dari environment variables.
 * Prioritas: process.env.ADMIN_DOORPASS -> process.env.NEXT_PUBLIC_ADMIN_DOORPASS.
 * TIDAK ADA fallback string default apa pun agar sandi selalu 100% dinamis mengikuti .env.local atau Vercel.
 */
export function getDoorpassSecret(): string {
  const secret =
    process.env.ADMIN_DOORPASS ||
    process.env.NEXT_PUBLIC_ADMIN_DOORPASS ||
    '';

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
