import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  DOORPASS_SESSION_COOKIE,
  LEGACY_DOORPASS_COOKIE,
  getDoorpassSecret,
  verifyDoorpassSessionToken,
  computeDoorpassHash,
  verifyAdminAuthToken,
  ADMIN_AUTH_COOKIE,
} from './lib/doorpass/core';

export async function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;
    const searchParams = request.nextUrl.searchParams;
    const secretDoorpass = getDoorpassSecret();

    // Helper untuk mengembalikan halaman 404 dan membersihkan cookie stale
    const send404 = () => {
      const notFoundUrl = new URL('/not-found', request.url);
      const response404 = NextResponse.rewrite(notFoundUrl, { status: 404 });
      response404.cookies.delete(DOORPASS_SESSION_COOKIE);
      response404.cookies.delete(LEGACY_DOORPASS_COOKIE);
      return response404;
    };

    // Jika ADMIN_DOORPASS belum disetel di .env, tolak semua akses ke /admin
    if (!secretDoorpass) {
      return send404();
    }

    // 1. Ekstrak input doorpass dari URL query (?doorpass=...) atau format /admin/doorpass=...
    let inputDoorpass = searchParams.get('doorpass');
    if (!inputDoorpass && pathname.includes('/admin/doorpass=')) {
      const parts = pathname.split('/admin/doorpass=');
      if (parts[1]) {
        inputDoorpass = decodeURIComponent(parts[1].split('/')[0]);
      }
    }

    // Ambil status sesi doorpass dan cek user Supabase serta sesi admin terverifikasi
    const doorpassSessionCookie = request.cookies.get(DOORPASS_SESSION_COOKIE)?.value;
    const isDoorpassSessionValid = await verifyDoorpassSessionToken(
      doorpassSessionCookie,
      secretDoorpass
    );

    const adminAuthCookie = request.cookies.get(ADMIN_AUTH_COOKIE)?.value;
    const adminAuth = await verifyAdminAuthToken(adminAuthCookie, secretDoorpass);

    let supabaseResponse = NextResponse.next({ request });
    supabaseResponse.cookies.delete(LEGACY_DOORPASS_COOKIE);

    let user = null;
    try {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value }) =>
                request.cookies.set(name, value)
              );
              supabaseResponse = NextResponse.next({ request });
              cookiesToSet.forEach(({ name, value, options }) =>
                supabaseResponse.cookies.set(name, value, options)
              );
            },
          },
        }
      );

      const { data } = await supabase.auth.getUser();
      user = data?.user || null;
    } catch (authErr) {
      console.error('Supabase middleware auth check warning:', authErr);
    }

    const isAuthenticatedAdmin = Boolean(user || adminAuth.valid);

    // KONDISI 1: User memasukkan doorpass di URL (misal: /admin?doorpass=mela)
    if (inputDoorpass !== null) {
      if (inputDoorpass.trim() === secretDoorpass) {
        const token = await computeDoorpassHash(secretDoorpass);

        // Jika user SUDAH login sebagai admin, langsung masuk ke /admin/proyek
        if (isAuthenticatedAdmin) {
          const redirectRes = NextResponse.redirect(new URL('/admin/proyek', request.url));
          redirectRes.cookies.set(DOORPASS_SESSION_COOKIE, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
          });
          return redirectRes;
        }

        // Jika user BELUM login dan sedang membuka /admin/login -> izinkan tampilkan form login!
        if (pathname === '/admin/login') {
          const nextRes = NextResponse.next();
          nextRes.cookies.set(DOORPASS_SESSION_COOKIE, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
          });
          return nextRes;
        }

        // Jika user BELUM login dan membuka /admin atau rute lain -> WAJIB diarahkan ke /admin/login!
        const redirectRes = NextResponse.redirect(
          new URL(`/admin/login?doorpass=${encodeURIComponent(secretDoorpass)}`, request.url)
        );
        redirectRes.cookies.set(DOORPASS_SESSION_COOKIE, token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
        });
        return redirectRes;
      } else {
        // Doorpass salah -> 404 Not Found!
        return send404();
      }
    }

    // KONDISI 2: User sudah terautentikasi sebagai Admin (tetap login, tidak akan ter-logout)
    if (isAuthenticatedAdmin) {
      if (pathname === '/admin' || pathname === '/admin/login') {
        return NextResponse.redirect(new URL('/admin/proyek', request.url));
      }
      return supabaseResponse;
    }

    // KONDISI 3: Sesi doorpass aktif namun BELUM login akun admin
    if (isDoorpassSessionValid) {
      if (pathname === '/admin/login') {
        return supabaseResponse;
      }
      return NextResponse.redirect(
        new URL(`/admin/login?doorpass=${encodeURIComponent(secretDoorpass)}`, request.url)
      );
    }

    // Jika BELUM login dan tanpa doorpass: WAJIB arahkan ke 404 Not Found (Stealth Mode)!
    return send404();
  } catch (err) {
    console.error('Middleware error caught:', err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
