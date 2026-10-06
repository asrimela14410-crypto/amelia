'use server';

import { cookies } from 'next/headers';
import {
  DOORPASS_SESSION_COOKIE,
  LEGACY_DOORPASS_COOKIE,
  computeDoorpassHash,
  getDoorpassSecret,
} from './core';

export async function revokeDoorpassAction() {
  const cookieStore = await cookies();
  cookieStore.delete(DOORPASS_SESSION_COOKIE);
  cookieStore.delete(LEGACY_DOORPASS_COOKIE);
  return { success: true };
}

export async function setDoorpassUnlockedAction(secretOverride?: string) {
  const cookieStore = await cookies();
  const secret = secretOverride || getDoorpassSecret();
  if (!secret) return { success: false };
  const token = await computeDoorpassHash(secret);
  cookieStore.set(DOORPASS_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  cookieStore.delete(LEGACY_DOORPASS_COOKIE);
  return { success: true };
}
