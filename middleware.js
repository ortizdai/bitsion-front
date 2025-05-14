import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'


export function middleware(request) {
  const cookieStore = cookies();
  const session = cookieStore.get('access_token')

  if (!session) {
    redirect('/')
  }
}

export const config = {
  matcher: ['/clients/:path*'],
}
