'use client'
import { useEffect, useState, useRef } from 'react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { formatDate, slugify } from '@/lib/utils'
import dynamic from 'next/dynamic'
import { createBrowserSupabase } from '@/lib/supabase-browser'

const RichEditor = dynamic(() => import('@/components/admin/RichEditor'), { ssr: false, loading: () => <div className="border border-[rgba(0,212,255,0.15)] h-64 flex items-center justify-center font-mono text-xs text-accent opacity-40">Editor yükleniyor...</div> })

type Post = { id: string; title: string; title_en: string; slug: string; excerpt: string; excerpt_en: string; content: string; content_en: string; tags: string[]; published: boolean; featured: boolean; published_at: string; cover_image: string }
const empty = (): Partial<Post> => ({ title: '', title_en: '', slug: '', excerpt: '', excerpt_en: '', content: '', content_en: '', tags: [], published: false, featured: false, cover_image: '' })

export default function AdminBlog() {
  const [posts, setPosts] = useState<Post[]>([])
  const [editing, setEditing] = useState<Partial<Post> | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [activeLang, setActiveLang] = useState<'tr' | 'en'>('tr')
  const [tagsInput, setTagsInput] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const load = () => fetch('/api/blog').then(r => r.json()).then(setPosts)

  useEffect(() => {
    if (editing) setTagsInput((editing.tags || []).join(', '))
    else setTagsInput('')
  }, [editing?.id])
  useEffect(() => { load() }, [])

  const uploadImage = async (file: File) => {
    setUploading(true)
    try {
      const supabase = createBrowserSupabase()
      const ext = file.name.split('.').pop()
      const fileName = `blog/${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('images').upload(fileName, file, { upsert: true })
      if (error) throw error
      const { data } = supabase.storage.from('images').getPublicUrl(fileName)
      setEditing(p => ({ ...p!, cover_image: data.publicUrl }))
      toast.success('Görsel yüklendi')
    } catch (e) {
      toast.error('Görsel yüklenemedi')
    }
    setUploading(false)
  }

  const save = async () => {
    if (!editing?.title) { toast.error('Başlık zorunlu'); return }
    setLoading(true)
    const payload = {
      ...editing,
      slug: editing.slug || slugify(editing.title!),
      published_at: editing.published && !editing.published_at ? new Date().toISOString() : editing.published_at,
    }
    const isNew = !editing?.id
    const url = isNew ? '/api/blog' : `/api/blog/${editing!.id}`
    const res = await fetch(url, { method: isNew ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) { toast.success(isNew ? 'Yazı eklendi' : 'Güncellendi'); setEditing(null); load() }
    else toast.error('Hata oluştu')
    setLoading(false)
  }

  const del = async (id: string) => {
    if (!confirm('Bu yazıyı silmek istediğinden emin misin?')) return
    await fetch(`/api/blog/${id}`, { method: 'DELETE' })
    toast.success('Silindi'); load()
  }

  if (editing !== null) return (
    <div className="p-8 max-w-3xl">
      <button onClick={() => setEditing(null)} className="font-mono text-[10px] text-accent opacity-60 hover:opacity-100 mb-6 block">← GERİ</button>
      <h1 className="font-orbitron text-xl font-black text-[#e8f4f8] mb-6">{editing.id ? 'Yazıyı Düzenle' : 'Yeni Yazı'}</h1>

      {/* Dil sekmesi */}
      <div className="flex gap-2 mb-6">
        {(['tr', 'en'] as const).map(lang => (
          <button key={lang} onClick={() => setActiveLang(lang)}
            className={`font-mono text-[10px] tracking-[3px] px-4 py-2 border transition-all ${activeLang === lang ? 'border-accent text-accent bg-[rgba(0,212,255,0.08)]' : 'border-[rgba(0,212,255,0.15)] text-[rgba(232,244,248,0.4)] hover:border-[rgba(0,212,255,0.3)]'}`}>
            {lang === 'tr' ? '🇹🇷 Türkçe' : '🇬🇧 English'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {activeLang === 'tr' ? (
          <>
            <Input label="BAŞLIK (TR)" value={editing.title || ''} onChange={e => { const title = e.target.value; setEditing(p => ({...p!, title, slug: slugify(title)})) }} />
            <Input label="SLUG" value={editing.slug || ''} onChange={e => setEditing(p => ({...p!, slug: e.target.value}))} />
            <Input label="ÖZET (TR)" value={editing.excerpt || ''} onChange={e => setEditing(p => ({...p!, excerpt: e.target.value}))} />
            <div>
              <p className="font-mono text-[9px] tracking-[4px] text-accent opacity-60 mb-2">İÇERİK (TR)</p>
              <RichEditor content={editing.content || ''} onChange={c => setEditing(p => ({...p!, content: c}))} />
            </div>
          </>
        ) : (
          <>
            <Input label="BAŞLIK (EN)" value={editing.title_en || ''} onChange={e => setEditing(p => ({...p!, title_en: e.target.value}))} />
            <Input label="ÖZET (EN)" value={editing.excerpt_en || ''} onChange={e => setEditing(p => ({...p!, excerpt_en: e.target.value}))} />
            <div>
              <p className="font-mono text-[9px] tracking-[4px] text-accent opacity-60 mb-2">İÇERİK (EN)</p>
              <RichEditor content={editing.content_en || ''} onChange={c => setEditing(p => ({...p!, content_en: c}))} />
            </div>
          </>
        )}

        {/* Kapak görseli — ortak */}
        <div>
          <p className="font-mono text-[10px] tracking-[3px] text-[rgba(232,244,248,0.5)] mb-2">KAPAK GÖRSELİ</p>
          {editing.cover_image && (
            <div className="relative w-full h-48 mb-3 border border-[rgba(0,212,255,0.15)] overflow-hidden">
              <img src={editing.cover_image} alt="preview" className="w-full h-full object-cover opacity-80" />
              <button onClick={() => setEditing(p => ({...p!, cover_image: ''}))}
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

        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[9px] tracking-[4px] text-accent opacity-60">ETİKETLER (virgülle ayır)</label>
          <input
            className="bg-[rgba(0,212,255,0.03)] border border-[rgba(0,212,255,0.15)] text-[#e8f4f8] px-4 py-3 text-sm outline-none transition-all duration-300 placeholder:text-[rgba(255,255,255,0.2)] focus:border-[rgba(0,212,255,0.5)]"
            placeholder="siber güvenlik, web, linux"
            value={tagsInput}
            onChange={e => {
              setTagsInput(e.target.value)
              setEditing(p => ({...p!, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)}))
            }}
          />
        </div>
        <label className="flex items-center gap-3 font-mono text-[10px] tracking-[3px] text-[rgba(232,244,248,0.5)] cursor-pointer">
          <input type="checkbox" checked={editing.published || false} onChange={e => setEditing(p => ({...p!, published: e.target.checked}))} className="accent-[#00d4ff]" />
          YAYINLA
        </label>
        <label className="flex items-center gap-3 font-mono text-[10px] tracking-[3px] text-[rgba(232,244,248,0.5)] cursor-pointer">
          <input type="checkbox" checked={editing.featured || false} onChange={e => setEditing(p => ({...p!, featured: e.target.checked}))} className="accent-[#00d4ff]" />
          ÖNE ÇIKAR (Ana sayfada göster)
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
          <p className="font-mono text-[9px] tracking-[5px] text-accent opacity-50 mb-1">// BLOG</p>
          <h1 className="font-orbitron text-2xl font-black text-[#e8f4f8]">Blog Yazıları</h1>
        </div>
        <Button onClick={() => setEditing(empty())}>+ Yeni Yazı</Button>
      </div>
      <div className="space-y-3">
        {posts.map(p => (
          <div key={p.id} className="flex items-center justify-between border border-[rgba(0,212,255,0.12)] px-6 py-4 hover:border-[rgba(0,212,255,0.3)] transition-colors">
            <div className="flex items-center gap-4">
              {p.cover_image
                ? <img src={p.cover_image} alt={p.title} className="w-12 h-12 object-cover border border-[rgba(0,212,255,0.2)]" />
                : <div className="w-12 h-12 border border-[rgba(0,212,255,0.1)] bg-[#030e1a] flex items-center justify-center font-mono text-[8px] text-accent opacity-30">IMG</div>
              }
              <div>
                <div className="flex items-center gap-3">
                  <p className="font-orbitron text-sm text-[#e8f4f8]">{p.title}</p>
                  <span className={`font-mono text-[8px] tracking-[2px] px-2 py-0.5 ${p.published ? 'text-green-400 border-green-400' : 'text-yellow-400 border-yellow-400'} border opacity-70`}>
                    {p.published ? 'YAYINDA' : 'TASLAK'}
                  </span>
                  {p.featured && <span className="font-mono text-[8px] tracking-[2px] px-2 py-0.5 text-accent border border-accent opacity-70">ÖNE ÇIKAR</span>}
                </div>
                <p className="font-mono text-[9px] text-[rgba(232,244,248,0.3)] mt-1">{p.published_at ? formatDate(p.published_at) : '—'} · /{p.slug}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setEditing(p)}>Düzenle</Button>
              <Button size="sm" variant="danger" onClick={() => del(p.id)}>Sil</Button>
            </div>
          </div>
        ))}
        {posts.length === 0 && <p className="font-mono text-sm text-[rgba(232,244,248,0.25)] py-10 text-center">// Henüz yazı yok</p>}
      </div>
    </div>
  )
}