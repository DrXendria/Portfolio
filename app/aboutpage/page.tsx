import { createServerSupabase } from '@/lib/supabase-server'
import AboutClient from './AboutClient'

export const revalidate = 60

export default async function AboutPage() {
  const sb = createServerSupabase()
  const { data: configRows } = await sb.from('site_config').select('*')
  const config = Object.fromEntries((configRows || []).map((r: any) => [r.key, r.value]))
  return <AboutClient config={config} />
}