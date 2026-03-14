'use client'
import Link from 'next/link'
import Navbar from '@/components/sections/Navbar'
import CyberGrid from '@/components/ui/CyberGrid'
import SkillsSection from '@/components/sections/SkillsSection'
import { useLocale } from '@/app/providers'

export default function SkillsClient({ categories, skills }: { categories: any[]; skills: any[] }) {
  const { locale } = useLocale()
  const t = (tr: string, en: string) => locale === 'en' ? en : tr

  return (
    <main className="relative min-h-screen">
      <CyberGrid />
      <Navbar />
      <div className="relative z-10 pt-16">
        <Link href="/" className="font-mono text-[10px] tracking-[3px] text-accent opacity-60 hover:opacity-100 transition-opacity px-6 md:px-20 pt-8 block">
          ← {t('ANA SAYFA', 'HOME')}
        </Link>
        <SkillsSection categories={categories} skills={skills} />
      </div>
    </main>
  )
}