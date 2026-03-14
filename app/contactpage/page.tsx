import { createServerSupabase } from '@/lib/supabase-server'
import ContactClient from './ContactClient'

export const revalidate = 60

export default async function ContactPage() {
  const sb = createServerSupabase()
  const { data: configRows } = await sb.from('site_config').select('*')
  const config = Object.fromEntries((configRows || []).map((r: any) => [r.key, r.value]))
  return <ContactClient config={config} />
}