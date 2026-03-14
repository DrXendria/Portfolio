'use client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

type Category = { id: string; name: string; name_en: string; icon: string; featured: boolean; order_index: number }
type Skill = { id: string; name: string; name_en: string; category_id: string; level: number; order_index: number; featured: boolean }

const emptyCategory = (): Partial<Category> => ({ name: '', name_en: '', icon: '⚡', featured: false, order_index: 0 })
const emptySkill = (category_id: string): Partial<Skill> => ({ name: '', name_en: '', category_id, level: 80, order_index: 0, featured: false })

export default function AdminSkills() {
  const [categories, setCategories] = useState<Category[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [editingCat, setEditingCat] = useState<Partial<Category> | null>(null)
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null)
  const [loading, setLoading] = useState(false)

  const loadCategories = () => fetch('/api/skill-categories').then(r => r.json()).then(setCategories)
  const loadSkills = () => fetch('/api/skills').then(r => r.json()).then(setSkills)

  useEffect(() => { loadCategories(); loadSkills() }, [])

  const saveCategory = async () => {
    setLoading(true)
    const isNew = !editingCat?.id
    const url = isNew ? '/api/skill-categories' : `/api/skill-categories/${editingCat!.id}`
    const res = await fetch(url, { method: isNew ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingCat) })
    if (res.ok) { toast.success(isNew ? 'Kategori eklendi' : 'Güncellendi'); setEditingCat(null); loadCategories() }
    else toast.error('Hata')
    setLoading(false)
  }

  const deleteCategory = async (id: string) => {
    if (!confirm('Bu kategoriyi ve altındaki tüm yetenekleri silmek istediğinden emin misin?')) return
    await fetch(`/api/skill-categories/${id}`, { method: 'DELETE' })
    toast.success('Silindi'); loadCategories(); loadSkills()
  }

  const saveSkill = async () => {
    setLoading(true)
    const isNew = !editingSkill?.id
    const url = isNew ? '/api/skills' : `/api/skills/${editingSkill!.id}`
    const res = await fetch(url, { method: isNew ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingSkill) })
    if (res.ok) {
      // Yetenek öne çıkarılmışsa kategorisini de otomatik öne çıkar
      if (editingSkill?.featured && editingSkill?.category_id) {
        await fetch(`/api/skill-categories/${editingSkill.category_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ featured: true })
        })
        loadCategories()
      }
      toast.success(isNew ? 'Yetenek eklendi' : 'Güncellendi'); setEditingSkill(null); loadSkills()
    }
    else toast.error('Hata')
    setLoading(false)
  }

  const deleteSkill = async (id: string) => {
    await fetch(`/api/skills/${id}`, { method: 'DELETE' })
    toast.success('Silindi'); loadSkills()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-[9px] tracking-[5px] text-accent opacity-50 mb-1">// YETENEKLERİM</p>
          <h1 className="font-orbitron text-2xl font-black text-[#e8f4f8]">Yetenekler</h1>
        </div>
        <Button onClick={() => setEditingCat(emptyCategory())}>+ Yeni Kategori</Button>
      </div>

      {/* Kategori formu */}
      {editingCat !== null && (
        <div className="border border-[rgba(0,212,255,0.2)] p-6 mb-8 bg-[rgba(0,212,255,0.02)]">
          <h2 className="font-orbitron text-sm text-accent mb-4">{editingCat.id ? 'KATEGORİ DÜZENLE' : 'YENİ KATEGORİ'}</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <Input label="KATEGORİ ADI (TR)" value={editingCat.name || ''} onChange={e => setEditingCat(p => ({...p!, name: e.target.value}))} />
            <Input label="KATEGORİ ADI (EN)" value={editingCat.name_en || ''} onChange={e => setEditingCat(p => ({...p!, name_en: e.target.value}))} />
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <Input label="İKON (emoji)" value={editingCat.icon || '⚡'} onChange={e => setEditingCat(p => ({...p!, icon: e.target.value}))} />
            <Input label="SIRA" type="number" value={editingCat.order_index ?? 0} onChange={e => setEditingCat(p => ({...p!, order_index: +e.target.value}))} />
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-3 font-mono text-[10px] tracking-[3px] text-[rgba(232,244,248,0.5)] cursor-pointer">
                <input type="checkbox" checked={editingCat.featured || false} onChange={e => setEditingCat(p => ({...p!, featured: e.target.checked}))} className="accent-[#00d4ff]" />
                ÖNE ÇIKAR
              </label>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={saveCategory} disabled={loading} size="sm">{loading ? '...' : 'KAYDET'}</Button>
            <Button variant="ghost" size="sm" onClick={() => setEditingCat(null)}>İPTAL</Button>
          </div>
        </div>
      )}

      {/* Yetenek formu */}
      {editingSkill !== null && (
        <div className="border border-[rgba(0,212,255,0.2)] p-6 mb-8 bg-[rgba(0,212,255,0.02)]">
          <h2 className="font-orbitron text-sm text-accent mb-4">{editingSkill.id ? 'YETENEK DÜZENLE' : 'YENİ YETENEK'}</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <Input label="İSİM (TR)" value={editingSkill.name || ''} onChange={e => setEditingSkill(p => ({...p!, name: e.target.value}))} />
            <Input label="İSİM (EN)" value={editingSkill.name_en || ''} onChange={e => setEditingSkill(p => ({...p!, name_en: e.target.value}))} />
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="font-mono text-[9px] tracking-[4px] text-accent opacity-60 block mb-1.5">KATEGORİ</label>
              <select
                className="w-full bg-[rgba(0,212,255,0.03)] border border-[rgba(0,212,255,0.15)] text-[#e8f4f8] px-4 py-3 text-sm outline-none focus:border-[rgba(0,212,255,0.5)]"
                value={editingSkill.category_id || ''}
                onChange={e => setEditingSkill(p => ({...p!, category_id: e.target.value}))}>
                <option value="">Seç...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
            <Input label="SEVİYE (0-100)" type="number" min={0} max={100} value={editingSkill.level ?? 80} onChange={e => setEditingSkill(p => ({...p!, level: +e.target.value}))} />
            <Input label="SIRA" type="number" value={editingSkill.order_index ?? 0} onChange={e => setEditingSkill(p => ({...p!, order_index: +e.target.value}))} />
          </div>
          <label className="flex items-center gap-3 font-mono text-[10px] tracking-[3px] text-[rgba(232,244,248,0.5)] cursor-pointer mb-4">
            <input type="checkbox" checked={editingSkill.featured || false} onChange={e => setEditingSkill(p => ({...p!, featured: e.target.checked}))} className="accent-[#00d4ff]" />
            ÖNE ÇIKAR (Ana sayfada göster)
          </label>
          <div className="flex gap-3">
            <Button onClick={saveSkill} disabled={loading} size="sm">{loading ? '...' : 'KAYDET'}</Button>
            <Button variant="ghost" size="sm" onClick={() => setEditingSkill(null)}>İPTAL</Button>
          </div>
        </div>
      )}

      {/* Kategori listesi */}
      {categories.sort((a, b) => a.order_index - b.order_index).map(cat => {
        const catSkills = skills.filter(s => s.category_id === cat.id).sort((a, b) => a.order_index - b.order_index)
        return (
          <div key={cat.id} className="mb-8">
            <div className="flex items-center justify-between border border-[rgba(0,212,255,0.15)] px-5 py-3 bg-[rgba(0,212,255,0.02)] mb-2">
              <div className="flex items-center gap-3">
                <span className="text-xl">{cat.icon}</span>
                <div>
                  <span className="font-mono text-[11px] tracking-[3px] text-accent">{cat.name}</span>
                  {cat.name_en && <span className="font-mono text-[10px] text-[rgba(232,244,248,0.3)] ml-2">/ {cat.name_en}</span>}
                </div>
                {cat.featured && <span className="font-mono text-[8px] tracking-[2px] px-2 py-0.5 text-accent border border-accent opacity-70 ml-2">ÖNE ÇIKAR</span>}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setEditingSkill(emptySkill(cat.id))}>+ Yetenek</Button>
                <Button size="sm" onClick={() => setEditingCat(cat)}>Düzenle</Button>
                <Button size="sm" variant="danger" onClick={() => deleteCategory(cat.id)}>Sil</Button>
              </div>
            </div>
            <div className="space-y-1 pl-4">
              {catSkills.map(s => (
                <div key={s.id} className="flex items-center gap-4 border border-[rgba(0,212,255,0.08)] px-5 py-2.5">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-1.5">
                      <span className="font-mono text-[11px] text-[rgba(232,244,248,0.6)]">{s.name}</span>
                      {s.name_en && <span className="font-mono text-[10px] text-[rgba(232,244,248,0.3)]">/ {s.name_en}</span>}
                      <span className="font-mono text-[10px] text-accent">{s.level}%</span>
                      {s.featured && <span className="font-mono text-[8px] tracking-[2px] px-2 py-0.5 text-accent border border-accent opacity-70">ÖNE ÇIKAR</span>}
                    </div>
                    <div className="h-1 bg-[rgba(0,212,255,0.08)] w-48">
                      <div className="h-full bg-accent" style={{ width: `${s.level}%` }} />
                    </div>
                  </div>
                  <Button size="sm" onClick={() => setEditingSkill(s)}>Düzenle</Button>
                  <Button size="sm" variant="danger" onClick={() => deleteSkill(s.id)}>Sil</Button>
                </div>
              ))}
              {catSkills.length === 0 && (
                <p className="font-mono text-[10px] text-[rgba(232,244,248,0.2)] py-3 px-2">// Henüz yetenek yok</p>
              )}
            </div>
          </div>
        )
      })}
      {categories.length === 0 && (
        <p className="font-mono text-sm text-[rgba(232,244,248,0.25)] py-10 text-center">// Henüz kategori yok</p>
      )}
    </div>
  )
}