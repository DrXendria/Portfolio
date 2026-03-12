'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import toast from 'react-hot-toast'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '⊞' },
  { href: '/admin/projects', label: 'Projeler', icon: '◈' },
  { href: '/admin/blog', label: 'Blog', icon: '✎' },
  { href: '/admin/skills', label: 'Yetenekler', icon: '◎' },
  { href: '/admin/messages', label: 'Mesajlar', icon: '✉' },
  { href: '/admin/settings', label: 'Site Ayarları', icon: '⚙' },
  { href: '/admin/cv', label: 'CV', icon: '↓' },
]

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)
  const sb = createBrowserSupabase()

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => {
      if (!data.session && pathname !== '/admin/login') router.push('/admin/login')
      setChecking(false)
    })
  }, [])

  const logout = async () => {
    await sb.auth.signOut()
    toast.success('Çıkış yapıldı')
    router.push('/admin/login')
  }

  if (pathname === '/admin/login') return <>{children}</>
  if (checking) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'#020b14'}}>
      <span className="font-mono text-accent animate-pulse text-sm tracking-widest">LOADING...</span>
    </div>
  )

  return (
    <div className="flex min-h-screen" style={{ background: '#020b14' }}>
      <aside className="w-60 flex-shrink-0 border-r border-[rgba(0,212,255,0.1)] bg-[rgba(3,14,26,0.8)] flex flex-col">
        <div className="px-6 py-6 border-b border-[rgba(0,212,255,0.1)]">
          <p className="font-mono text-[8px] tracking-[4px] text-accent opacity-50 mb-1">// ADMIN_PANEL</p>
          <Link href="/">
            <img src="/logo.png" alt="CICA" width={125} height={125} className="object-contain"
              style={{ mixBlendMode: 'lighten', filter: 'drop-shadow(0 0 6px rgba(0,212,255,0.3))' }} />
          </Link>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map(item => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-6 py-3 font-mono text-[10px] tracking-[2px] transition-all duration-200 border-l-2 ${
                pathname.startsWith(item.href)
                  ? 'border-accent text-accent bg-[rgba(0,212,255,0.05)]'
                  : 'border-transparent text-[rgba(232,244,248,0.35)] hover:text-accent hover:bg-[rgba(0,212,255,0.03)]'
              }`}>
              <span>{item.icon}</span>{item.label}
            </Link>
          ))}
        </nav>
        <div className="px-6 py-6 border-t border-[rgba(0,212,255,0.1)]">
          <button onClick={logout}
            className="w-full font-mono text-[10px] tracking-[2px] text-[rgba(255,80,80,0.5)] hover:text-red-400 transition-colors text-left flex items-center gap-2">
            <span>⏻</span> Çıkış Yap
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="fixed inset-0 left-60 cyber-grid-bg opacity-20 pointer-events-none" />
        <div className="relative z-10">{children}</div>
      </main>
    </div>
  )
}