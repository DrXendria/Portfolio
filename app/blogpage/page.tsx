import { createServerSupabase } from '@/lib/supabase-server'
import BlogClient from './BlogClient'

export const revalidate = 60

export default async function BlogPage() {
  const sb = createServerSupabase()
  const { data: posts } = await sb.from('blog_posts').select('*').eq('published', true).order('published_at', { ascending: false })
  return <BlogClient posts={posts || []} />
}