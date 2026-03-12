'use client'
import { useEffect } from 'react'
import { useLocale } from '@/app/providers'
import CyberGrid from '@/components/ui/CyberGrid'
import Navbar from '@/components/sections/Navbar'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import BlogSection from '@/components/sections/BlogSection'
import SkillsSection from '@/components/sections/SkillsSection'
import ContactSection from '@/components/sections/ContactSection'

type Props = {
  projects: any[]
  posts: any[]
  skills: any[]
  config: Record<string, string>
}

const sections = ['hero', 'about', 'projects', 'blog', 'skills', 'contact']

export default function HomeClient({ projects, posts, skills, config }: Props) {
  const { locale } = useLocale()

  // Scroll pozisyonuna göre URL güncelle
  useEffect(() => {
    // Sayfa yüklenince URL'deki path veya query param'dan section'a scroll et
    const params = new URLSearchParams(window.location.search)
    const section = params.get('section') || window.location.pathname.replace('/', '') || 'hero'
    const el = document.getElementById(section)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      // Query param'ı temizle, URL'i düzelt
      window.history.replaceState(null, '', section === 'hero' ? '/' : `/${section}`)
    }

    // IntersectionObserver ile aktif section'ı takip et
    const observers: IntersectionObserver[] = []
    sections.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const newPath = id === 'hero' ? '/' : `/${id}`
            window.history.replaceState(null, '', newPath)
          }
        },
        { threshold: 0.4 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [])

  const localizedConfig = {
    ...config,
    hero_name: config.hero_name,
    hero_surname: config.hero_surname,
    hero_title: locale === 'en' ? (config.hero_title_en || config.hero_title) : config.hero_title,
    hero_desc: locale === 'en' ? (config.hero_desc_en || config.hero_desc) : config.hero_desc,
    about_text: locale === 'en' ? (config.about_text_en || config.about_text) : config.about_text,
    contact_desc: locale === 'en' ? (config.contact_desc_en || config.contact_desc) : config.contact_desc,
  }

  const localizedProjects = projects.map(p => ({
    ...p,
    title: locale === 'en' ? (p.title_en || p.title) : p.title,
    description: locale === 'en' ? (p.description_en || p.description) : p.description,
    long_description: locale === 'en' ? (p.long_description_en || p.long_description) : p.long_description,
  }))

  const localizedPosts = posts.map(p => ({
    ...p,
    title: locale === 'en' ? (p.title_en || p.title) : p.title,
    excerpt: locale === 'en' ? (p.excerpt_en || p.excerpt) : p.excerpt,
    content: locale === 'en' ? (p.content_en || p.content) : p.content,
  }))

  const localizedSkills = skills.map(s => ({
    ...s,
    category: locale === 'en' ? (s.category_en || s.category) : s.category,
  }))

  return (
    <main className="relative">
      <div className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(0,180,255,0.05) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(0,100,200,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <CyberGrid />
      <Navbar />
      <div id="hero"><HeroSection config={localizedConfig} /></div>
      <div id="about"><AboutSection config={localizedConfig} /></div>
      <div id="projects"><ProjectsSection projects={localizedProjects} /></div>
      <div id="blog"><BlogSection posts={localizedPosts} /></div>
      <div id="skills"><SkillsSection skills={localizedSkills} /></div>
      <div id="contact"><ContactSection config={localizedConfig} /></div>
      <footer className="relative z-10 border-t border-[rgba(0,212,255,0.1)] px-6 md:px-20 py-8 flex justify-between items-center flex-wrap gap-4">
        <p className="font-mono text-[10px] tracking-[2px] text-[rgba(232,244,248,0.25)]">© 2026 {localizedConfig.hero_name} {localizedConfig.hero_surname}</p>
        <p className="font-mono text-[10px] tracking-[2px] text-[rgba(0,212,255,0.25)]">Designed by DrXendria</p>
      </footer>
    </main>
  )
}