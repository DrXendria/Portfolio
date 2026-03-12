'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, posts: 0, messages: 0, unread: 0 })

  useEffect(() => {
    Promise.all([
      fetch('/api/projects').then(r => r.json()),
      fetch('/api/blog').then(r => r.json()),
      fetch('/api/messages').then(r => r.json()),
    ]).then(([projects, posts, messages]) => {
      setStats({
        projects: projects.length,
        posts: posts.length,
        messages: messages.length,
        unread: messages.filter((m: any) => !m.read).length,
      })
    })
  }, [])

  const cards = [
    { label: 'Projeler', value: stats.projects, href: '/admin/projects', icon: '◈', color: 'text-accent' },
    { label: 'Blog Yazısı', value: stats.posts, href: '/admin/blog', icon: '✎', color: 'text-accent' },
    { label: 'Toplam Mesaj', value: stats.messages, href: '/admin/messages', icon: '✉', color: 'text-accent' },
    { label: 'Okunmamış', value: stats.unread, href: '/admin/messages', icon: '●', color: 'text-yellow-400' },
  ]

  return (
    <div className="p-8">
      <p className="font-mono text-[9px] tracking-[5px] text-accent opacity-50 mb-2">// ADMIN_PANEL</p>
      <h1 className="font-orbitron text-2xl font-black text-[#e8f4f8] mb-10">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map(c => (
          <Link key={c.label} href={c.href}
            className="clip-cyber border border-[rgba(0,212,255,0.15)] bg-[rgba(0,212,255,0.02)] p-6 hover:border-[rgba(0,212,255,0.4)] hover:bg-[rgba(0,212,255,0.05)] transition-all">
            <div className={`font-orbitron text-3xl font-black ${c.color} mb-2`}>{c.value}</div>
            <div className="font-mono text-[9px] tracking-[2px] text-[rgba(232,244,248,0.35)]">{c.label}</div>
          </Link>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { title: 'Hızlı Erişim', links: [
            { href: '/admin/projects', label: '+ Yeni Proje Ekle' },
            { href: '/admin/blog', label: '+ Yeni Blog Yazısı' },
            { href: '/admin/skills', label: '+ Yeni Yetenek Ekle' },
            { href: '/admin/settings', label: '⚙ Site Ayarlarını Düzenle' },
          ]},
        ].map(section => (
          <div key={section.title} className="border border-[rgba(0,212,255,0.12)] p-6">
            <h2 className="font-orbitron text-sm text-[#e8f4f8] mb-4">{section.title}</h2>
            <div className="space-y-2">
              {section.links.map(l => (
                <Link key={l.href} href={l.href}
                  className="block font-mono text-[10px] tracking-[2px] text-[rgba(232,244,248,0.4)] hover:text-accent transition-colors py-1.5 border-b border-[rgba(0,212,255,0.06)] last:border-0">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}