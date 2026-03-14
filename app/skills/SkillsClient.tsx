'use client'
import Link from 'next/link'
import Navbar from '@/components/sections/Navbar'
import CyberGrid from '@/components/ui/CyberGrid'
import SkillsSection from '@/components/sections/SkillsSection'
import { useLocale } from '@/app/providers'

export default function SkillsClient({ skills }: { skills: any[] }) {
  const { locale } = useLocale()
  const t = (tr: string, en: string) => locale === 'en' ? en : tr

  const localizedSkills = skills.map(s => ({
    ...s,
    category: locale === 'en' ? (s.category_en || s.category) : s.category,
  }))

  return (
    <main className="relative min-h-screen">
      <CyberGrid />
      <Navbar />
      <div className="relative z-10 px-6 md:px-20 pt-28 pb-24">
        <Link href="/" className="font-mono text-[10px] tracking-[3px] text-accent opacity-60 hover:opacity-100 transition-opacity mb-8 block">← {t('ANA SAYFA', 'HOME')}</Link>
        <SkillsSection skills={localizedSkills} />
      </div>
    </main>
  )
}