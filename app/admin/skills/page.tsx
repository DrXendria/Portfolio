'use client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

type Skill = { id: string; name: string; name_en: string; category: string; category_en: string; level: number; order_index: number; icon: string }
const empty = (): Partial<Skill> => ({ name: '', name_en: '', category: '', category_en: '', level: 80, order_index: 0, icon: '⚡' })

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [editing, setEditing] = useState<Partial<Skill> | null>(null)
  const [loading, setLoading] = useState(false)

  const load = () => fetch('/api/skills').then(r => r.json()).then(setSkills)
  useEffect(() => { load() }, [])

  const save = async () => {
    setLoading(true)
    const isNew = !editing?.id
    const url = isNew ? '/api/skills' : `/api/skills/${editing!.id}`
    const res = await fetch(url, { method: isNew ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) })
    if (res.ok) { toast.success(isNew ? 'Eklendi' : 'Güncellendi'); setEditing(null); load() }
    else toast.error('Hata')
    setLoading(false)
  }

  const del = async (id: string) => {
    await fetch(`/api/skills/${id}`, { method: 'DELETE' })
    toast.success('Silindi'); load()
  }

  const categories = [...new Set(skills.map(s => s.category))]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-[9px] tracking-[5px] text-accent opacity-50 mb-1">// YETENEKLERİM</p>
          <h1 className="font-orbitron text-2xl font-black text-[#e8f4f8]">Yetenekler</h1>
        </div>
        <Button onClick={() => setEditing(empty())}>+ Yeni Yetenek</Button>
      </div>

      {editing !== null && (
        <div className="border border-[rgba(0,212,255,0.2)] p-6 mb-8 bg-[rgba(0,212,255,0.02)]">
          <h2 className="font-orbitron text-sm text-accent mb-4">{editing.id ? 'DÜZENLE' : 'YENİ YETENEK'}</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <Input label="İSİM (TR)" value={editing.name || ''} onChange={e => setEditing(p => ({...p!, name: e.target.value}))} />
            <Input label="İSİM (EN)" value={editing.name_en || ''} onChange={e => setEditing(p => ({...p!, name_en: e.target.value}))} />
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <Input label="KATEGORİ (TR)" value={editing.category || ''} onChange={e => setEditing(p => ({...p!, category: e.target.value}))} />
            <Input label="KATEGORİ (EN)" value={editing.category_en || ''} onChange={e => setEditing(p => ({...p!, category_en: e.target.value}))} />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Input label="KATEGORİ İKONU (emoji)" value={editing.icon || '⚡'} onChange={e => setEditing(p => ({...p!, icon: e.target.value}))} />
              <p className="font-mono text-[9px] text-[rgba(232,244,248,0.3)] mt-1">Aynı kategorideki tüm yetenekler bu ikonu kullanır</p>
            </div>
            <Input label="SEVİYE (0-100)" type="number" min={0} max={100} value={editing.level ?? 80} onChange={e => setEditing(p => ({...p!, level: +e.target.value}))} />
            <Input label="SIRA" type="number" value={editing.order_index ?? 0} onChange={e => setEditing(p => ({...p!, order_index: +e.target.value}))} />
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={save} disabled={loading} size="sm">{loading ? '...' : 'KAYDET'}</Button>
            <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>İPTAL</Button>
          </div>
        </div>
      )}

      {categories.map(cat => {
        const catSkills = skills.filter(s => s.category === cat)
        const icon = catSkills[0]?.icon || '⚡'
        const catEn = catSkills[0]?.category_en || ''
        return (
          <div key={cat} className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{icon}</span>
              <p className="font-mono text-[10px] tracking-[4px] text-accent opacity-50">{cat}</p>
              {catEn && <p className="font-mono text-[10px] tracking-[2px] text-[rgba(232,244,248,0.25)]">/ {catEn}</p>}
            </div>
            <div className="space-y-2">
              {catSkills.map(s => (
                <div key={s.id} className="flex items-center gap-4 border border-[rgba(0,212,255,0.1)] px-5 py-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="font-mono text-[11px] text-[rgba(232,244,248,0.6)]">{s.name}</span>
                      {s.name_en && <span className="font-mono text-[10px] text-[rgba(232,244,248,0.3)]">/ {s.name_en}</span>}
                      <span className="font-mono text-[10px] text-accent">{s.level}%</span>
                    </div>
                    <div className="h-1 bg-[rgba(0,212,255,0.08)] w-48">
                      <div className="h-full bg-accent" style={{ width: `${s.level}%` }} />
                    </div>
                  </div>
                  <Button size="sm" onClick={() => setEditing(s)}>Düzenle</Button>
                  <Button size="sm" variant="danger" onClick={() => del(s.id)}>Sil</Button>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}