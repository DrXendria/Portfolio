'use client'
import Link from 'next/link'
import SectionHeader from '@/components/ui/SectionHeader'
import { formatDate } from '@/lib/utils'
import { useLocale } from '@/app/providers'

type BlogPost = { id: string; slug: string; title: string; excerpt: string; content: string; tags: string[]; published: boolean; published_at: string; cover_image: string }

export default function BlogSection({ posts }: { posts: BlogPost[] }) {
  const { locale } = useLocale()
  const t = (tr: string, en: string) => locale === 'en' ? en : tr

  return (
    <section id="blog" className="relative z-10 px-6 md:px-20 py-24">
      <SectionHeader index={t('003 — BLOG', '003 — BLOG')} title={t('Son Yazılar', 'Latest Posts')} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(p => (
          <Link href={`/blog/${p.slug}`} key={p.id}
            className="border border-[rgba(0,212,255,0.15)] bg-[rgba(0,212,255,0.01)] hover:border-[rgba(0,212,255,0.45)] hover:-translate-y-1 transition-all duration-300 group block clip-cyber overflow-hidden">
            <div className="h-44 bg-[#030e1a] relative overflow-hidden">
              {p.cover_image
                ? <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500" />
                : <div className="w-full h-full cyber-grid-bg flex items-center justify-center">
                    <span className="font-mono text-[10px] tracking-[4px] text-accent opacity-20">{p.title}</span>
                  </div>
              }
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(2,11,20,0.7)] to-transparent" />
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {p.tags.slice(0,3).map(tag => (
                  <span key={tag} className="font-mono text-[8px] tracking-[2px] px-2.5 py-1 border border-[rgba(0,212,255,0.2)] text-accent opacity-70">{tag}</span>
                ))}
              </div>
              <h3 className="font-orbitron text-base text-[#e8f4f8] mb-3 group-hover:text-accent transition-colors">{p.title}</h3>
              <p className="text-sm text-[rgba(232,244,248,0.45)] leading-relaxed mb-6">{p.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] text-[rgba(232,244,248,0.25)] tracking-[2px]">{p.published_at ? formatDate(p.published_at) : ''}</span>
                <span className="font-mono text-[10px] text-accent opacity-0 group-hover:opacity-100 transition-opacity">{t('OKU →', 'READ →')}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {posts.length === 0 && (
        <p className="font-mono text-sm text-[rgba(232,244,248,0.3)] text-center py-16">{t('// Henüz yazı yok', '// No posts yet')}</p>
      )}
    </section>
  )
}