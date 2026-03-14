import { createServerSupabase } from '@/lib/supabase-server'
import SkillsClient from '../skills/SkillsClient'

export const revalidate = 60

export default async function SkillsPage() {
  const sb = createServerSupabase()
  const [{ data: categories }, { data: skills }] = await Promise.all([
    sb.from('skill_categories').select('*').order('order_index'),
    sb.from('skills').select('*').order('order_index'),
  ])
  return <SkillsClient categories={categories || []} skills={skills || []} />
}