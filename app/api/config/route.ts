import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  const { data, error } = await supabaseAdmin.from('site_config').select('*')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
export async function POST(req: NextRequest) {
  const body = await req.json() // [{ key, value }]
  for (const item of body) {
    await supabaseAdmin.from('site_config').upsert({ key: item.key, value: item.value }, { onConflict: 'key' })
  }
  return NextResponse.json({ ok: true })
}
