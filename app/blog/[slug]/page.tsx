import { createServerSupabase } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import Navbar from '@/components/sections/Navbar'
import CyberGrid from '@/components/ui/CyberGrid'

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const sb = createServerSupabase()
  const { data: post } = await sb.from('blog_posts').select('*').eq('slug', params.slug).eq('published', true).single()
  if (!post) notFound()

  return (
    <main className="relative min-h-screen">
      <CyberGrid />
      <Navbar />
      <article className="relative z-10 max-w-3xl mx-auto px-6 pt-28 pb-24">
        <Link href="/blogpage" className="font-mono text-[10px] tracking-[3px] text-accent opacity-60 hover:opacity-100 transition-opacity mb-8 block">← BLOG'A DÖN</Link>
        <div className="flex flex-wrap gap-2 mb-6">
          {(post as any).tags?.map((t: string) => (
            <span key={t} className="font-mono text-[8px] tracking-[2px] px-2.5 py-1 border border-[rgba(0,212,255,0.2)] text-accent opacity-70">{t}</span>
          ))}
        </div>
        <h1 className="font-orbitron text-3xl md:text-4xl font-black text-[#e8f4f8] mb-4">{(post as any).title}</h1>
        <p className="font-mono text-[10px] tracking-[3px] text-[rgba(232,244,248,0.3)] mb-12">
          {(post as any).published_at ? formatDate((post as any).published_at) : ''}
        </p>
        <div className="tiptap-content border-t border-[rgba(0,212,255,0.1)] pt-10"
          dangerouslySetInnerHTML={{ __html: (post as any).content }} />
      </article>
    </main>
  )
}