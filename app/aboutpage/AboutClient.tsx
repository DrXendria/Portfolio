'use client'
import Link from 'next/link'
import Navbar from '@/components/sections/Navbar'
import CyberGrid from '@/components/ui/CyberGrid'
import AboutSection from '@/components/sections/AboutSection'
import { useLocale } from '@/app/providers'

export default function AboutClient({ config }: { config: Record<string, string> }) {
  const { locale } = useLocale()
  const t = (tr: string, en: string) => locale === 'en' ? en : tr

  const localizedConfig = {
    ...config,
    hero_title: locale === 'en' ? (config.hero_title_en || config.hero_title) : config.hero_title,
    about_text: locale === 'en' ? (config.about_text_en || config.about_text) : config.about_text,
  }

  return (
    <main className="relative min-h-screen">
      <CyberGrid />
      <Navbar />
      <div className="relative z-10 pt-16">
        <AboutSection config={localizedConfig} />
      </div>
    </main>
  )
}