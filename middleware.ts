// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET!);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  // Si no hay token, redirigir a login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verificar token
  try {
    await jwtVerify(token, SECRET);
    return NextResponse.next(); // Token válido, continuar
  } catch {
    // Token inválido o expirado
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth-token');
    return response;
  }
}

// Solo aplicar a rutas /admin
export const config = {
  matcher: '/admin/:path*',
};
