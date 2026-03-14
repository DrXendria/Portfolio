'use client'
import Link from 'next/link'
import Navbar from '@/components/sections/Navbar'
import CyberGrid from '@/components/ui/CyberGrid'
import SectionHeader from '@/components/ui/SectionHeader'
import ProjectsSection from '@/components/sections/ProjectsSection'
import { useLocale } from '@/app/providers'

export default function ProjectsClient({ projects }: { projects: any[] }) {
  const { locale } = useLocale()
  const t = (tr: string, en: string) => locale === 'en' ? en : tr

  const localizedProjects = projects.map(p => ({
    ...p,
    title: locale === 'en' ? (p.title_en || p.title) : p.title,
    description: locale === 'en' ? (p.description_en || p.description) : p.description,
    long_description: locale === 'en' ? (p.long_description_en || p.long_description) : p.long_description,
  }))

  return (
    <main className="relative min-h-screen">
      <CyberGrid />
      <Navbar />
      <div className="relative z-10 px-6 md:px-20 pt-28 pb-24">
        <Link href="/" className="font-mono text-[10px] tracking-[3px] text-accent opacity-60 hover:opacity-100 transition-opacity mb-8 block">← {t('ANA SAYFA', 'HOME')}</Link>
        <ProjectsSection projects={localizedProjects} />
      </div>
    </main>
  )
}