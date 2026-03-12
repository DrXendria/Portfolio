'use client'
import SectionHeader from '@/components/ui/SectionHeader'
import { useLocale } from '@/app/providers'

type Props = { config: Record<string, string> }

export default function AboutSection({ config }: Props) {
  const { locale } = useLocale()
  const t = (tr: string, en: string) => locale === 'en' ? en : tr

  const stats = [
    { num: config.stat_projects || '12+', label: t('Tamamlanan Proje', 'Completed Projects') },
    { num: config.stat_years || '1', label: t('Yıl Deneyim', 'Years Experience') },
    { num: config.stat_clients || '0', label: t('Mutlu Müşteri', 'Happy Clients') },
    { num: '∞', label: t('Kahve Bardağı', 'Cups of Coffee') },
  ]

  return (
    <section id="about" className="relative z-10 px-6 md:px-20 py-24">
      <div className="grid grid-cols-2 md:grid-cols-4 border border-[rgba(0,212,255,0.15)] mb-20"
        style={{ background: 'rgba(2,11,20,0.6)' }}>
        {stats.map((s, i) => (
          <div key={i} className="py-8 px-6 text-center border-r border-b border-[rgba(0,212,255,0.1)] last:border-r-0 hover:bg-[rgba(0,212,255,0.03)] transition-colors">
            <div className="font-orbitron text-4xl font-black text-accent" style={{ textShadow: '0 0 20px rgba(0,212,255,0.4)' }}>{s.num}</div>
            <div className="font-mono text-[10px] tracking-[3px] text-[rgba(232,244,248,0.35)] mt-2">{s.label}</div>
          </div>
        ))}
      </div>

      <SectionHeader index={t('001 — HAKKIMDA', '001 — ABOUT')} title={t('Ben Kimim?', 'Who Am I?')} />
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <p className="text-base text-[rgba(232,244,248,0.55)] leading-relaxed font-light"
          dangerouslySetInnerHTML={{ __html: config.about_text || t('Hakkımda bilgi henüz eklenmedi.', 'No info added yet.') }} />

        {config.about_image ? (
          <div className="flex justify-center md:justify-end">
            <div className="relative w-72 h-72 clip-cyber overflow-hidden border border-[rgba(0,212,255,0.25)]"
              style={{ boxShadow: '0 0 40px rgba(0,212,255,0.1)' }}>
              <img src={config.about_image} alt="Profil" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(2,11,20,0.3)] to-transparent" />
            </div>
          </div>
        ) : (
          <div className="flex justify-center md:justify-end">
            <div className="w-72 h-72 clip-cyber border border-[rgba(0,212,255,0.15)] bg-[#030e1a] cyber-grid-bg flex items-center justify-center">
              <span className="font-mono text-[10px] tracking-[3px] text-accent opacity-30">{t('FOTOĞRAF YOK', 'NO PHOTO')}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}