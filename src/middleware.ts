import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  DOORPASS_SESSION_COOKIE,
  LEGACY_DOORPASS_COOKIE,
  getDoorpassSecret,
  verifyDoorpassSessionToken,
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

    // Ambil status sesi doorpass dan cek user Supabase
    const doorpassSessionCookie = request.cookies.get(DOORPASS_SESSION_COOKIE)?.value;
    const isDoorpassSessionValid = await verifyDoorpassSessionToken(
      doorpassSessionCookie,
      secretDoorpass
    );

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

    // KONDISI 1: User memasukkan doorpass di URL (misal: /admin?doorpass=mela)
    if (inputDoorpass !== null) {
      if (inputDoorpass.trim() === secretDoorpass) {
        // Jika user SUDAH login -> langsung masuk ke studio panel!
        if (user) {
          return NextResponse.redirect(new URL('/admin/proyek', request.url));
        }

        // Jika belum login dan bukan di /admin/login -> arahkan ke login dengan doorpass
        if (pathname !== '/admin/login') {
          const loginUrl = new URL('/admin/login', request.url);
          loginUrl.searchParams.set('doorpass', secretDoorpass);
          const redirectRes = NextResponse.redirect(loginUrl);
          redirectRes.cookies.delete(LEGACY_DOORPASS_COOKIE);
          return redirectRes;
        }

        // Jika sudah di /admin/login dengan doorpass valid, izinkan tampil
        const nextRes = NextResponse.next();
        nextRes.cookies.delete(LEGACY_DOORPASS_COOKIE);
        return nextRes;
      } else {
        // Doorpass salah -> 404 Not Found!
        return send404();
      }
    }

    // KONDISI 2: TIDAK ada doorpass di URL (misal hanya mengetik /admin atau /admin/proyek)
    if (user && isDoorpassSessionValid) {
      if (pathname === '/admin' || pathname === '/admin/login') {
        return NextResponse.redirect(new URL('/admin/proyek', request.url));
      }
      return supabaseResponse;
    }

    // Jika BELUM login atau tanpa doorpass: WAJIB arahkan ke 404 Not Found!
    return send404();
  } catch (err) {
    console.error('Middleware error caught:', err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
