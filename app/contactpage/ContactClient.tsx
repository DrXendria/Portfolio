'use client'
import Navbar from '@/components/sections/Navbar'
import CyberGrid from '@/components/ui/CyberGrid'
import ContactSection from '@/components/sections/ContactSection'
import { useLocale } from '@/app/providers'

export default function ContactClient({ config }: { config: Record<string, string> }) {
  const { locale } = useLocale()

  const localizedConfig = {
    ...config,
    contact_desc: locale === 'en' ? (config.contact_desc_en || config.contact_desc) : config.contact_desc,
  }

  return (
    <main className="relative min-h-screen">
      <CyberGrid />
      <Navbar />
      <div className="relative z-10 pt-16">
        <ContactSection config={localizedConfig} />
      </div>
    </main>
  )
}