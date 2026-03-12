'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function AdminCV() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const save = async () => {
    setLoading(true)
    const res = await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([{ key: 'cv_url', value: url }]),
    })
    if (res.ok) toast.success('CV URL kaydedildi')
    else toast.error('Hata')
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-xl">
      <p className="font-mono text-[9px] tracking-[5px] text-accent opacity-50 mb-1">// CV</p>
      <h1 className="font-orbitron text-2xl font-black text-[#e8f4f8] mb-4">CV Yönetimi</h1>
      <p className="font-mono text-xs text-[rgba(232,244,248,0.35)] mb-8 leading-relaxed">
        CV dosyanı Supabase Storage, Google Drive veya herhangi bir cloud servisine yükleyip
        buraya public URL'ini gir. Sitedeki "CV İndir" butonu bu URL'e yönlenecek.
      </p>
      <div className="space-y-4">
        <Input label="CV DOSYA URL" placeholder="https://drive.google.com/..." value={url} onChange={e => setUrl(e.target.value)} />
        <Button onClick={save} disabled={loading}>{loading ? 'KAYDEDİLİYOR...' : 'KAYDET'}</Button>
      </div>
    </div>
  )
}
