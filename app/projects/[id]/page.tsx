import { createServerSupabase } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import ProjectDetailClient from '../[id]/ProjectDetailClient'

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const sb = createServerSupabase()
  const { data: project } = await sb.from('projects').select('*').eq('slug', params.id).single()
  if (!project) notFound()
  return <ProjectDetailClient project={project} />
}