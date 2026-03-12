'use client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'

type Message = { id: string; name: string; email: string; message: string; read: boolean; created_at: string }

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [selected, setSelected] = useState<Message | null>(null)

  const load = () => fetch('/api/messages').then(r => r.json()).then(setMessages)
  useEffect(() => { load() }, [])

  const markRead = async (id: string) => {
    await fetch(`/api/messages/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ read: true }) })
    load()
  }
  const del = async (id: string) => {
    if (!confirm('Bu mesajı silmek istiyor musun?')) return
    await fetch(`/api/messages/${id}`, { method: 'DELETE' })
    toast.success('Silindi'); setSelected(null); load()
  }

  const open = (m: Message) => {
    setSelected(m)
    if (!m.read) markRead(m.id)
  }

  const unread = messages.filter(m => !m.read).length

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="font-mono text-[9px] tracking-[5px] text-accent opacity-50 mb-1">// MESAJLAR</p>
        <div className="flex items-center gap-4">
          <h1 className="font-orbitron text-2xl font-black text-[#e8f4f8]">Mesajlar</h1>
          {unread > 0 && <span className="font-mono text-[9px] px-2.5 py-1 border border-yellow-400 text-yellow-400">{unread} OKUNMADI</span>}
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          {messages.map(m => (
            <div key={m.id} onClick={() => open(m)}
              className={`border px-5 py-4 cursor-pointer transition-all ${selected?.id === m.id ? 'border-accent bg-[rgba(0,212,255,0.05)]' : m.read ? 'border-[rgba(0,212,255,0.1)] hover:border-[rgba(0,212,255,0.25)]' : 'border-[rgba(0,212,255,0.3)] bg-[rgba(0,212,255,0.02)]'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`font-orbitron text-sm ${m.read ? 'text-[rgba(232,244,248,0.6)]' : 'text-[#e8f4f8]'}`}>{m.name}</span>
                {!m.read && <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />}
              </div>
              <p className="font-mono text-[9px] text-[rgba(232,244,248,0.3)]">{m.email}</p>
              <p className="text-xs text-[rgba(232,244,248,0.4)] mt-2 truncate">{m.message}</p>
              <p className="font-mono text-[8px] text-[rgba(232,244,248,0.2)] mt-2">{formatDate(m.created_at)}</p>
            </div>
          ))}
          {messages.length === 0 && <p className="font-mono text-sm text-[rgba(232,244,248,0.25)] py-10 text-center">// Henüz mesaj yok</p>}
        </div>
        {selected && (
          <div className="border border-[rgba(0,212,255,0.2)] p-6 bg-[rgba(0,212,255,0.02)] h-fit">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="font-orbitron text-base text-[#e8f4f8]">{selected.name}</h2>
                <a href={`mailto:${selected.email}`} className="font-mono text-[10px] text-accent hover:underline">{selected.email}</a>
              </div>
              <Button size="sm" variant="danger" onClick={() => del(selected.id)}>Sil</Button>
            </div>
            <p className="text-sm text-[rgba(232,244,248,0.6)] leading-relaxed whitespace-pre-wrap border-t border-[rgba(0,212,255,0.1)] pt-4">{selected.message}</p>
            <p className="font-mono text-[9px] text-[rgba(232,244,248,0.25)] mt-4">{formatDate(selected.created_at)}</p>
          </div>
        )}
      </div>
    </div>
  )
}
