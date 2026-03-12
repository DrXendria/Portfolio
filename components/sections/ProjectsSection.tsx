'use client'
import SectionHeader from '@/components/ui/SectionHeader'
import { useLocale } from '@/app/providers'

type Project = { id: string; title: string; description: string; tech_stack: string[]; live_url: string; github_url: string; image_url: string; featured: boolean; order_index: number }

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  const { locale } = useLocale()
  const t = (tr: string, en: string) => locale === 'en' ? en : tr

  return (
    <section id="projects" className="relative z-10 px-6 md:px-20 py-24">
      <SectionHeader index={t('002 — PROJELER', '002 — PROJECTS')} title={t('Seçilmiş Çalışmalar', 'Selected Works')} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(p => (
          <div key={p.id} className="border border-[rgba(0,212,255,0.15)] bg-[rgba(0,212,255,0.01)] hover:border-[rgba(0,212,255,0.45)] hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
            <div className="h-44 bg-[#030e1a] relative overflow-hidden">
              {p.image_url
                ? <>
                    <img src={p.image_url} alt={p.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(2,11,20,0.7)] to-transparent" />
                  </>
                : <div className="w-full h-full cyber-grid-bg flex items-center justify-center">
                    <span className="font-mono text-[10px] tracking-[4px] text-accent opacity-20">{p.title}</span>
                  </div>
              }
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-3">
                {p.tech_stack.slice(0,4).map(tech => (
                  <span key={tech} className="font-mono text-[8px] tracking-[2px] px-2.5 py-1 border border-[rgba(0,212,255,0.2)] text-accent opacity-70 clip-cyber-sm">{tech}</span>
                ))}
              </div>
              <h3 className="font-orbitron text-base text-[#e8f4f8] mb-2">{p.title}</h3>
              <p className="text-sm text-[rgba(232,244,248,0.45)] leading-relaxed mb-4">{p.description}</p>
              <div className="flex gap-4">
                {p.live_url && <a href={p.live_url} target="_blank" className="font-mono text-[10px] text-accent hover:underline">→ {t('Canlı', 'Live')}</a>}
                {p.github_url && <a href={p.github_url} target="_blank" className="font-mono text-[10px] text-[rgba(232,244,248,0.35)] hover:text-accent transition-colors">⌥ GitHub</a>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}