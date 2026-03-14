import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

const sectionRoutes = ['/about', '/projects', '/blog', '/skills', '/contact']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const pathname = req.nextUrl.pathname

  // Scroll URL'lerini ana sayfaya yönlendir
  if (sectionRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL(`/?section=${pathname.slice(1)}`, req.url))
  }

  if (!pathname.startsWith('/admin') || pathname === '/admin/login') return res

  const sb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => req.cookies.get(name)?.value,
        set: (name: string, value: string, options: object) => { res.cookies.set({ name, value, ...options }) },
        remove: (name: string, options: object) => { res.cookies.set({ name, value: '', ...options }) },
      },
    }
  )

  const { data: { session } } = await sb.auth.getSession()
  if (!session) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }
  return res
}

export const config = { matcher: ['/admin/:path*', '/about', '/projects', '/blog', '/skills', '/contact'] }