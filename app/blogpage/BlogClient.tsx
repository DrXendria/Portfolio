'use client'
import Link from 'next/link'
import Navbar from '@/components/sections/Navbar'
import CyberGrid from '@/components/ui/CyberGrid'
import BlogSection from '@/components/sections/BlogSection'
import { useLocale } from '@/app/providers'

export default function BlogClient({ posts }: { posts: any[] }) {
  const { locale } = useLocale()
  const t = (tr: string, en: string) => locale === 'en' ? en : tr

  const localizedPosts = posts.map(p => ({
    ...p,
    title: locale === 'en' ? (p.title_en || p.title) : p.title,
    excerpt: locale === 'en' ? (p.excerpt_en || p.excerpt) : p.excerpt,
    content: locale === 'en' ? (p.content_en || p.content) : p.content,
  }))

  return (
    <main className="relative min-h-screen">
      <CyberGrid />
      <Navbar />
      <div className="relative z-10 px-6 md:px-20 pt-28 pb-24">
        <Link href="/" className="font-mono text-[10px] tracking-[3px] text-accent opacity-60 hover:opacity-100 transition-opacity mb-8 block">← {t('ANA SAYFA', 'HOME')}</Link>
        <BlogSection posts={localizedPosts} />
      </div>
    </main>
  )
}