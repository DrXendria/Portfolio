'use client'
import { useState } from 'react'
import { createBrowserSupabase } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const sb = createBrowserSupabase()

  const handleLogin = async () => {
    setLoading(true)
    const { error } = await sb.auth.signInWithPassword({ email, password })
    if (error) { toast.error('Giriş başarısız: ' + error.message); setLoading(false); return }
    toast.success('Giriş başarılı')
    router.push('/admin/dashboard')
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 relative"
      style={{ background: '#020b14' }}>
      <div className="fixed inset-0 cyber-grid-bg opacity-50 pointer-events-none" />
      <div className="relative z-10 w-full max-w-sm">
        <div className="clip-cyber border border-[rgba(0,212,255,0.2)] bg-[rgba(3,14,26,0.9)] p-10">
          <p className="font-mono text-[9px] tracking-[5px] text-accent opacity-60 mb-2">// ADMIN_ACCESS</p>
          <h1 className="font-orbitron text-2xl font-black text-[#e8f4f8] mb-8">Giriş Yap</h1>
          <div className="space-y-4 mb-6">
            <Input label="E-POSTA" type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com" onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            <Input label="ŞİFRE" type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>
          <Button onClick={handleLogin} disabled={loading} className="w-full justify-center">
            {loading ? 'GİRİŞ YAPILIYOR...' : 'GİRİŞ YAP'}
          </Button>
        </div>
      </div>
    </main>
  )
}
