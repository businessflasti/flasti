import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Redirigir a la nueva ruta
  return NextResponse.redirect(new URL('/dashboard/aplicaciones', request.url));
}
