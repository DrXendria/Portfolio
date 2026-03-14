'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale } from '@/app/providers'

const links = {
  tr: [
    { href: '/aboutpage', label: 'Hakkımda', section: 'about' },
    { href: '/projectspage', label: 'Projeler', section: 'projects' },
    { href: '/blogpage', label: 'Blog', section: 'blog' },
    { href: '/skillspage', label: 'Yetenekler', section: 'skills' },
    { href: '/contactpage', label: 'İletişim', section: 'contact' },
  ],
  en: [
    { href: '/aboutpage', label: 'About', section: 'about' },
    { href: '/projectspage', label: 'Projects', section: 'projects' },
    { href: '/blogpage', label: 'Blog', section: 'blog' },
    { href: '/skillspage', label: 'Skills', section: 'skills' },
    { href: '/contactpage', label: 'Contact', section: 'contact' },
  ],
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { locale, setLocale } = useLocale()
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = (e: React.MouseEvent, section: string) => {
    if (isHome) {
      e.preventDefault()
      const el = document.getElementById(section)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
      window.history.pushState(null, '', `/${section}`)
    }
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-20 h-16 transition-all duration-300 ${scrolled ? 'bg-[rgba(2,11,20,0.9)] backdrop-blur-md border-b border-[rgba(0,212,255,0.12)]' : ''}`}>
      <Link href="/">
        <img src="/logo.png" alt="CICA" width={125} height={125} className="object-contain"
          style={{ mixBlendMode: 'lighten', filter: 'drop-shadow(0 0 6px rgba(0,212,255,0.3))' }} />
      </Link>

      <ul className="flex gap-3 md:gap-8">
        {links[locale].map(l => (
          <li key={l.href}>
            <Link href={l.href} onClick={e => handleClick(e, l.section)}
              className="font-mono text-[8px] md:text-[11px] tracking-[1px] md:tracking-[3px] text-[rgba(232,244,248,0.45)] hover:text-accent transition-colors duration-300 relative group">
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent shadow-neon-sm group-hover:w-full transition-all duration-300" />
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3 font-mono text-[11px] tracking-[2px]">
        <div className="flex items-center gap-1.5">
          {locale === 'tr' && <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-neon-sm" />}
          <button onClick={() => setLocale('tr')}
            className={`transition-colors duration-200 ${locale === 'tr' ? 'text-accent' : 'text-[rgba(232,244,248,0.3)] hover:text-[rgba(232,244,248,0.6)]'}`}>
            TR
          </button>
        </div>
        <span className="text-[rgba(232,244,248,0.2)]">/</span>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setLocale('en')}
            className={`transition-colors duration-200 ${locale === 'en' ? 'text-accent' : 'text-[rgba(232,244,248,0.3)] hover:text-[rgba(232,244,248,0.6)]'}`}>
            EN
          </button>
          {locale === 'en' && <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-neon-sm" />}
        </div>
      </div>
    </nav>
  )
}