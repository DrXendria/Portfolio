'use client'
import { useEffect, useState, useRef } from 'react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { createBrowserSupabase } from '@/lib/supabase-browser'

type Project = { id: string; title: string; title_en: string; description: string; description_en: string; long_description: string; long_description_en: string; tech_stack: string[]; live_url: string; github_url: string; image_url: string; featured: boolean; order_index: number }
const empty = (): Partial<Project> => ({ title: '', title_en: '', description: '', description_en: '', long_description: '', long_description_en: '', tech_stack: [], live_url: '', github_url: '', image_url: '', featured: false, order_index: 0 })

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [editing, setEditing] = useState<Partial<Project> | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [techInput, setTechInput] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () => fetch('/api/projects').then(r => r.json()).then(setProjects)
  useEffect(() => { load() }, [])

  useEffect(() => {
    if (editing) setTechInput((editing.tech_stack || []).join(', '))
    else setTechInput('')
  }, [editing?.id])

  const uploadImage = async (file: File) => {
    setUploading(true)
    try {
      const supabase = createBrowserSupabase()
      const ext = file.name.split('.').pop()
      const fileName = `projects/${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('images').upload(fileName, file, { upsert: true })
      if (error) throw error
      const { data } = supabase.storage.from('images').getPublicUrl(fileName)
      setEditing(p => ({ ...p!, image_url: data.publicUrl }))
      toast.success('Görsel yüklendi')
    } catch (e) {
      toast.error('Görsel yüklenemedi')
    }
    setUploading(false)
  }

  const save = async () => {
    setLoading(true)
    const isNew = !editing?.id
    const url = isNew ? '/api/projects' : `/api/projects/${editing!.id}`
    const res = await fetch(url, { method: isNew ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) })
    if (res.ok) { toast.success(isNew ? 'Proje eklendi' : 'Güncellendi'); setEditing(null); load() }
    else toast.error('Hata oluştu')
    setLoading(false)
  }

  const del = async (id: string) => {
    if (!confirm('Bu projeyi silmek istediğinden emin misin?')) return
    await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    toast.success('Silindi'); load()
  }

  if (editing !== null) return (
    <div className="p-8 max-w-2xl">
      <button onClick={() => setEditing(null)} className="font-mono text-[10px] text-accent opacity-60 hover:opacity-100 mb-6 block">← GERİ</button>
      <h1 className="font-orbitron text-xl font-black text-[#e8f4f8] mb-8">{editing.id ? 'Projeyi Düzenle' : 'Yeni Proje'}</h1>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="BAŞLIK (TR)" value={editing.title || ''} onChange={e => setEditing(p => ({...p!, title: e.target.value}))} />
          <Input label="BAŞLIK (EN)" value={editing.title_en || ''} onChange={e => setEditing(p => ({...p!, title_en: e.target.value}))} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Textarea label="KISA AÇIKLAMA (TR)" value={editing.description || ''} onChange={e => setEditing(p => ({...p!, description: e.target.value}))} className="min-h-[80px]" />
          <Textarea label="KISA AÇIKLAMA (EN)" value={editing.description_en || ''} onChange={e => setEditing(p => ({...p!, description_en: e.target.value}))} className="min-h-[80px]" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Textarea label="UZUN AÇIKLAMA (TR)" value={editing.long_description || ''} onChange={e => setEditing(p => ({...p!, long_description: e.target.value}))} />
          <Textarea label="UZUN AÇIKLAMA (EN)" value={editing.long_description_en || ''} onChange={e => setEditing(p => ({...p!, long_description_en: e.target.value}))} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[9px] tracking-[4px] text-accent opacity-60">TEKNOLOJİLER (virgülle ayır)</label>
          <input
            className="bg-[rgba(0,212,255,0.03)] border border-[rgba(0,212,255,0.15)] text-[#e8f4f8] px-4 py-3 text-sm outline-none transition-all duration-300 placeholder:text-[rgba(255,255,255,0.2)] focus:border-[rgba(0,212,255,0.5)]"
            placeholder="react, nextjs, typescript"
            value={techInput}
            onChange={e => {
              setTechInput(e.target.value)
              setEditing(p => ({...p!, tech_stack: e.target.value.split(',').map(t => t.trim()).filter(Boolean)}))
            }}
          />
        </div>
        <Input label="CANLI URL" value={editing.live_url || ''} onChange={e => setEditing(p => ({...p!, live_url: e.target.value}))} />
        <Input label="GITHUB URL" value={editing.github_url || ''} onChange={e => setEditing(p => ({...p!, github_url: e.target.value}))} />

        <div>
          <p className="font-mono text-[10px] tracking-[3px] text-[rgba(232,244,248,0.5)] mb-2">PROJE GÖRSELİ</p>
          {editing.image_url && (
            <div className="relative w-full h-40 mb-3 border border-[rgba(0,212,255,0.15)] overflow-hidden">
              <img src={editing.image_url} alt="preview" className="w-full h-full object-cover opacity-80" />
              <button onClick={() => setEditing(p => ({...p!, image_url: ''}))}
                className="absolute top-2 right-2 font-mono text-[10px] bg-[rgba(0,0,0,0.7)] text-accent border border-[rgba(0,212,255,0.3)] px-2 py-1 hover:bg-red-900 transition-colors">✕ Kaldır</button>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f) }} />
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            className="w-full border border-dashed border-[rgba(0,212,255,0.25)] py-4 font-mono text-[10px] tracking-[3px] text-[rgba(0,212,255,0.5)] hover:border-[rgba(0,212,255,0.6)] hover:text-accent transition-all">
            {uploading ? 'YÜKLENİYOR...' : '+ GÖRSEL SEÇ'}
          </button>
        </div>

        <Input label="SIRA" type="number" value={editing.order_index ?? 0} onChange={e => setEditing(p => ({...p!, order_index: +e.target.value}))} />
        <label className="flex items-center gap-3 font-mono text-[10px] tracking-[3px] text-[rgba(232,244,248,0.5)] cursor-pointer">
          <input type="checkbox" checked={editing.featured || false} onChange={e => setEditing(p => ({...p!, featured: e.target.checked}))} className="accent-[#00d4ff]" />
          ÖNE ÇIKAR
        </label>
        <div className="flex gap-3 pt-2">
          <Button onClick={save} disabled={loading || uploading}>{loading ? 'KAYDEDİLİYOR...' : 'KAYDET'}</Button>
          <Button variant="ghost" onClick={() => setEditing(null)}>İPTAL</Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-[9px] tracking-[5px] text-accent opacity-50 mb-1">// PROJELER</p>
          <h1 className="font-orbitron text-2xl font-black text-[#e8f4f8]">Projeler</h1>
        </div>
        <Button onClick={() => setEditing(empty())}>+ Yeni Proje</Button>
      </div>
      <div className="space-y-3">
        {projects.map(p => (
          <div key={p.id} className="flex items-center justify-between border border-[rgba(0,212,255,0.12)] px-6 py-4 hover:border-[rgba(0,212,255,0.3)] transition-colors">
            <div className="flex items-center gap-4">
              {p.image_url
                ? <img src={p.image_url} alt={p.title} className="w-12 h-12 object-cover border border-[rgba(0,212,255,0.2)]" />
                : <div className="w-12 h-12 border border-[rgba(0,212,255,0.1)] bg-[#030e1a] flex items-center justify-center font-mono text-[8px] text-accent opacity-30">IMG</div>
              }
              <div>
                <p className="font-orbitron text-sm text-[#e8f4f8]">{p.title}</p>
                <p className="font-mono text-[9px] text-[rgba(232,244,248,0.3)] mt-1">{p.tech_stack.join(' · ')}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setEditing(p)}>Düzenle</Button>
              <Button size="sm" variant="danger" onClick={() => del(p.id)}>Sil</Button>
            </div>
          </div>
        ))}
        {projects.length === 0 && <p className="font-mono text-sm text-[rgba(232,244,248,0.25)] py-10 text-center">// Henüz proje yok</p>}
      </div>
    </div>
  )
}