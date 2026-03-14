import { createServerSupabase } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const sb = createServerSupabase()
  const body = await req.json()
  const { data, error } = await sb.from('skill_categories').update(body).eq('id', params.id).select().single()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const sb = createServerSupabase()
  // Önce kategorideki yetenekleri sil
  await sb.from('skills').delete().eq('category_id', params.id)
  await sb.from('skill_categories').delete().eq('id', params.id)
  return NextResponse.json({ ok: true })
}