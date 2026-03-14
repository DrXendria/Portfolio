'use client'
import Link from 'next/link'
import Navbar from '@/components/sections/Navbar'
import CyberGrid from '@/components/ui/CyberGrid'
import { useLocale } from '@/app/providers'
import { Github } from 'lucide-react'

type Props = { project: any }

export default function ProjectDetailClient({ project }: Props) {
  const { locale } = useLocale()
  const t = (tr: string, en: string) => locale === 'en' ? en : tr

  const title = locale === 'en' ? (project.title_en || project.title) : project.title
  const description = locale === 'en' ? (project.long_description_en || project.long_description || project.description_en || project.description) : (project.long_description || project.description)

  return (
    <main className="relative min-h-screen">
      <CyberGrid />
      <Navbar />
      <article className="relative z-10 max-w-3xl mx-auto px-6 pt-28 pb-24">
        <Link href="/projectspage" className="font-mono text-[10px] tracking-[3px] text-accent opacity-60 hover:opacity-100 transition-opacity mb-8 block">
          ← {t('PROJELERE DÖN', 'BACK TO PROJECTS')}
        </Link>

        {project.image_url && (
          <div className="w-full h-64 mb-10 overflow-hidden border border-[rgba(0,212,255,0.2)]">
            <img src={project.image_url} alt={title} className="w-full h-full object-cover opacity-80" />
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech_stack?.map((t: string) => (
            <span key={t} className="font-mono text-[8px] tracking-[2px] px-2.5 py-1 border border-[rgba(0,212,255,0.2)] text-accent opacity-70">{t}</span>
          ))}
        </div>

        <h1 className="font-orbitron text-3xl md:text-4xl font-black text-[#e8f4f8] mb-6">{title}</h1>

        <p className="text-base text-[rgba(232,244,248,0.55)] leading-relaxed mb-10">{description}</p>

        <div className="flex gap-4">
          {project.live_url && (
            <a href={project.live_url} target="_blank"
              className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest px-6 py-3 border border-accent text-accent hover:bg-accent hover:text-[#020b14] transition-all">
              → {t('Canlıya Git', 'View Live')}
            </a>
          )}
          {project.github_url && (
            <a href={project.github_url} target="_blank"
              className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest px-6 py-3 border border-[rgba(255,255,255,0.15)] text-[rgba(255,255,255,0.4)] hover:border-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,0.7)] transition-all">
              <span className='text-accent'><Github/></span>
            </a>
          )}
        </div>
      </article>
    </main>
  )
}