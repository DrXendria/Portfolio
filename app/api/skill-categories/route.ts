import { createServerSupabase } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  const sb = createServerSupabase()
  const { data } = await sb.from('skill_categories').select('*').order('order_index')
  return NextResponse.json(data || [])
}

export async function POST(req: Request) {
  const sb = createServerSupabase()
  const body = await req.json()
  const { data, error } = await sb.from('skill_categories').insert(body).select().single()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}