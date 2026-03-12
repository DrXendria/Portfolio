import { createServerSupabase } from '@/lib/supabase-server'
import HomeClient from '@/components/HomeClient'

export const revalidate = 60

async function getData() {
  const sb = createServerSupabase()
  const [projects, posts, skills, configRows] = await Promise.all([
    sb.from('projects').select('*').order('order_index').then(r => r.data || []),
    sb.from('blog_posts').select('*').eq('published', true).order('published_at', { ascending: false }).limit(6).then(r => r.data || []),
    sb.from('skills').select('*').order('order_index').then(r => r.data || []),
    sb.from('site_config').select('*').then(r => r.data || []),
  ])
  const config = Object.fromEntries((configRows as any[]).map((r: any) => [r.key, r.value]))
  return { projects: projects as any[], posts: posts as any[], skills: skills as any[], config }
}

export default async function Home() {
  const { projects, posts, skills, config } = await getData()
  return <HomeClient projects={projects} posts={posts} skills={skills} config={config} />
}