import { createServerSupabase } from '@/lib/supabase-server'
import ProjectsClient from './ProjectsClient'

export const revalidate = 60

export default async function ProjectsPage() {
  const sb = createServerSupabase()
  const { data: projects } = await sb.from('projects').select('*').order('order_index')
  return <ProjectsClient projects={projects || []} />
}