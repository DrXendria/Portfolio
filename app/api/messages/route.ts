import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, message } = body
  if (!name || !email || !message) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  const { error } = await supabaseAdmin.from('messages').insert({ name, email, message, read: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function GET() {
  const { data, error } = await supabaseAdmin.from('messages').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
