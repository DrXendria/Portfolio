'use client'
import { useRef } from 'react'
import Button from '@/components/ui/Button'
import { useLocale } from '@/app/providers'

type Props = { config: Record<string, string> }

export default function HeroSection({ config }: Props) {
  const nameRef = useRef<HTMLHeadingElement>(null)
  const { locale } = useLocale()
  const t = (tr: string, en: string) => locale === 'en' ? en : tr

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16 overflow-hidden">
      <p className="font-mono text-[11px] tracking-[5px] text-accent opacity-70 mb-7 animate-pulse">
        {t('// Portfolyoma hoş geldin!', '// Welcome to my portfolio!')}
      </p>

      <h1
        ref={nameRef}
        className="relative z-10 font-orbitron text-[clamp(44px,9vw,100px)] font-black leading-none"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #00d4ff 45%, #0088cc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 0 30px rgba(0,212,255,0.4))',
        }}
      >
        {config.hero_name || 'ADI'}<br />{config.hero_surname || 'SOYADI'}
      </h1>

      <p className="relative z-10 font-mono text-[clamp(10px,2vw,13px)] tracking-[8px] text-[rgba(0,212,255,0.5)] mt-5">
        {config.hero_title || t('Siber Güvenlik Meraklısı', 'Cyber Security Enthusiast')}
      </p>

      <div className="w-px h-14 bg-gradient-to-b from-transparent via-accent to-transparent my-9"
        style={{ boxShadow: '0 0 8px #00d4ff' }} />

      <p className="relative z-10 max-w-lg text-base leading-[1.9] text-[rgba(232,244,248,0.45)] font-light"
        dangerouslySetInnerHTML={{
          __html: config.hero_desc || t(
            'Kullanıcı odaklı dijital deneyimler tasarlıyor, ölçeklenebilir backend sistemleri kuruyorum.',
            'Designing user-focused digital experiences and building scalable backend systems.'
          ),
        }}
      />

      <div className="flex gap-4 mt-12 flex-wrap justify-center">
        <Button href="#projects">{t('Projeleri Gör', 'View Projects')}</Button>
        <Button href="#contact" variant="ghost">{t('İletişime Geç', 'Contact Me')}</Button>
        {config.cv_url && (
          <a href={config.cv_url} download
            className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest px-6 py-3 clip-btn border border-[rgba(255,255,255,0.15)] text-[rgba(255,255,255,0.4)] hover:text-accent hover:border-accent transition-all duration-300">
            ↓ {t('CV İndir', 'Download CV')}
          </a>
        )}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-30">
        <div className="w-px h-10 bg-gradient-to-b from-accent to-transparent animate-bounce" />
      </div>
    </section>
  )
}