'use client'
import { useEffect, useRef, useState } from 'react'
import SectionHeader from '@/components/ui/SectionHeader'
import { useLocale } from '@/app/providers'

type Category = { id: string; name: string; name_en: string; icon: string; featured: boolean; order_index: number }
type Skill = { id: string; name: string; name_en: string; category_id: string; level: number; order_index: number; featured: boolean }

type Props = { categories: Category[]; skills: Skill[] }

export default function SkillsSection({ categories, skills }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [animated, setAnimated] = useState(false)
  const { locale } = useLocale()
  const t = (tr: string, en: string) => locale === 'en' ? en : tr

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setAnimated(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="skills" className="relative z-10 px-6 md:px-20 py-24" ref={ref}>
      <SectionHeader index={t('004 — YETENEKLER', '004 — SKILLS')} title={t('Yetenekler', 'Skills')} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.sort((a, b) => a.order_index - b.order_index).map(cat => {
          const catSkills = skills.filter(s => s.category_id === cat.id).sort((a, b) => a.order_index - b.order_index)
          return (
            <div key={cat.id} className="clip-cyber border border-[rgba(0,212,255,0.15)] bg-[rgba(0,212,255,0.02)] hover:border-[rgba(0,212,255,0.4)] transition-all duration-300 p-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{cat.icon}</span>
                <span className="font-mono text-[11px] tracking-[3px] text-accent">
                  {locale === 'en' ? (cat.name_en || cat.name) : cat.name}
                </span>
              </div>
              <div className="space-y-4">
                {catSkills.map(s => (
                  <div key={s.id}>
                    <div className="flex justify-between mb-1.5">
                      <span className="font-mono text-[11px] tracking-[2px] text-[rgba(232,244,248,0.6)]">
                        {locale === 'en' ? (s.name_en || s.name) : s.name}
                      </span>
                      <span className="font-mono text-[11px] text-accent">{s.level}%</span>
                    </div>
                    <div className="h-[3px] bg-[rgba(0,212,255,0.08)] overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#0088cc] to-accent transition-all duration-[1200ms] ease-out"
                        style={{ width: animated ? `${s.level}%` : '0%', boxShadow: '0 0 8px #00d4ff' }} />
                    </div>
                  </div>
                ))}
                {catSkills.length === 0 && (
                  <p className="font-mono text-[10px] text-[rgba(232,244,248,0.2)]">// {t('Henüz yetenek yok', 'No skills yet')}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}