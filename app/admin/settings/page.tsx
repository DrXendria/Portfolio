'use client'
import { useEffect, useState, useRef } from 'react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import { createBrowserSupabase } from '@/lib/supabase-browser'

const fields = [
  { key: 'hero_name', label: 'AD', placeholder: 'Adın' },
  { key: 'hero_surname', label: 'SOYAD', placeholder: 'Soyadın' },
  { key: 'hero_title', label: 'ÜNVAN (TR)', placeholder: 'Full Stack Developer' },
  { key: 'hero_title_en', label: 'ÜNVAN (EN)', placeholder: 'Full Stack Developer' },
  { key: 'hero_desc', label: 'KISA TANITIM (TR / HTML)', placeholder: 'Kullanıcı odaklı...' },
  { key: 'hero_desc_en', label: 'KISA TANITIM (EN / HTML)', placeholder: 'Building user-focused...' },
  { key: 'about_text', label: 'HAKKIMDA METNİ (TR / HTML)', placeholder: 'Ben...', textarea: true },
  { key: 'about_text_en', label: 'HAKKIMDA METNİ (EN / HTML)', placeholder: 'I am...', textarea: true },
  { key: 'stat_projects', label: 'PROJE İSTATİSTİĞİ', placeholder: '12+' },
  { key: 'stat_years', label: 'DENEYİM YILI', placeholder: '5' },
  { key: 'stat_clients', label: 'MÜŞTERİ SAYISI', placeholder: '8' },
  { key: 'contact_desc', label: 'İLETİŞİM AÇIKLAMASI (TR)', placeholder: 'Yeni proje...', textarea: true },
  { key: 'contact_desc_en', label: 'İLETİŞİM AÇIKLAMASI (EN)', placeholder: 'New project...', textarea: true },
  { key: 'contact_email', label: 'E-POSTA', placeholder: 'mail@example.com' },
  { key: 'contact_linkedin', label: 'LINKEDIN URL', placeholder: 'https://...' },
  { key: 'contact_github', label: 'GITHUB URL', placeholder: 'https://...' },
]

export default function AdminSettings() {
  const [config, setConfig] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/config').then(r => r.json()).then((data: any[]) => {
      setConfig(Object.fromEntries(data.map(d => [d.key, d.value])))
    })
  }, [])

  const uploadPhoto = async (file: File) => {
    setUploading(true)
    try {
      const supabase = createBrowserSupabase()
      const ext = file.name.split('.').pop()
      const fileName = `about/profile.${ext}`
      const { error } = await supabase.storage.from('images').upload(fileName, file, { upsert: true })
      if (error) throw error
      const { data } = supabase.storage.from('images').getPublicUrl(fileName)
      setConfig(c => ({ ...c, about_image: data.publicUrl }))
      toast.success('Fotoğraf yüklendi')
    } catch (e) {
      toast.error('Fotoğraf yüklenemedi')
    }
    setUploading(false)
  }

  const save = async () => {
    setLoading(true)
    const payload = Object.entries(config).map(([key, value]) => ({ key, value }))
    const res = await fetch('/api/config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) toast.success('Ayarlar kaydedildi')
    else toast.error('Hata oluştu')
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-2xl">
      <p className="font-mono text-[9px] tracking-[5px] text-accent opacity-50 mb-1">// AYARLAR</p>
      <h1 className="font-orbitron text-2xl font-black text-[#e8f4f8] mb-10">Site Ayarları</h1>
      <div className="space-y-5">
        <div>
          <p className="font-mono text-[10px] tracking-[3px] text-[rgba(232,244,248,0.5)] mb-2">PROFİL FOTOĞRAFI</p>
          {config.about_image && (
            <div className="relative w-32 h-32 mb-3 border border-[rgba(0,212,255,0.15)] overflow-hidden">
              <img src={config.about_image} alt="profil" className="w-full h-full object-cover" />
              <button onClick={() => setConfig(c => ({ ...c, about_image: '' }))}
                className="absolute top-1 right-1 font-mono text-[10px] bg-[rgba(0,0,0,0.7)] text-accent border border-[rgba(0,212,255,0.3)] px-1.5 py-0.5 hover:bg-red-900 transition-colors">✕</button>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) uploadPhoto(f) }} />
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            className="w-full border border-dashed border-[rgba(0,212,255,0.25)] py-4 font-mono text-[10px] tracking-[3px] text-[rgba(0,212,255,0.5)] hover:border-[rgba(0,212,255,0.6)] hover:text-accent transition-all">
            {uploading ? 'YÜKLENİYOR...' : '+ FOTOĞRAF SEÇ'}
          </button>
        </div>
        {fields.map(f => f.textarea
          ? <Textarea key={f.key} label={f.label} placeholder={f.placeholder} value={config[f.key] || ''} onChange={e => setConfig(c => ({...c, [f.key]: e.target.value}))} />
          : <Input key={f.key} label={f.label} placeholder={f.placeholder} value={config[f.key] || ''} onChange={e => setConfig(c => ({...c, [f.key]: e.target.value}))} />
        )}
      </div>
      <Button onClick={save} disabled={loading || uploading} className="mt-8">{loading ? 'KAYDEDİLİYOR...' : 'KAYDET'}</Button>
    </div>
  )
}