'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import SectionHeader from '@/components/ui/SectionHeader'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import { Github, Linkedin, Mail } from 'lucide-react'
import { useLocale } from '@/app/providers'

type Props = { config: Record<string, string> }

export default function ContactSection({ config }: Props) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const { locale } = useLocale()
  const t = (tr: string, en: string) => locale === 'en' ? en : tr

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      toast.error(t('Tüm alanları doldurun', 'Please fill in all fields'))
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      toast.success(t('Mesajın iletildi!', 'Message sent!'))
      setForm({ name: '', email: '', message: '' })
    } catch {
      toast.error(t('Bir hata oluştu, tekrar dene', 'An error occurred, please try again'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="relative z-10 px-6 md:px-20 py-24">
      <SectionHeader index={t('005 — İLETİŞİM', '005 — CONTACT')} title={t('Seninle Çalışalım', "Let's Work Together")} />
      <div className="grid md:grid-cols-2 gap-16">
        <div>
          <p className="text-base text-[rgba(232,244,248,0.5)] leading-relaxed font-light mb-8">
            {config.contact_desc || t('Yeni bir proje mi planlıyorsun? Her türlü konuşmaya açığım.', 'Planning a new project? I am open to any kind of conversation.')}
          </p>
          <div className="space-y-3">
            {config.contact_email && (
              <a href={`mailto:${config.contact_email}`} className="flex items-center gap-4 font-mono text-xs text-[rgba(232,244,248,0.4)] px-4 py-3 border border-transparent hover:border-[rgba(0,212,255,0.2)] hover:text-accent transition-all">
                <span className="text-accent"><Mail /></span>{config.contact_email}
              </a>
            )}
            {config.contact_linkedin && (
              <a href={config.contact_linkedin} target="_blank" className="flex items-center gap-4 font-mono text-xs text-[rgba(232,244,248,0.4)] px-4 py-3 border border-transparent hover:border-[rgba(0,212,255,0.2)] hover:text-accent transition-all">
                <span className="text-accent"><Linkedin /></span>{config.contact_linkedin}
              </a>
            )}
            {config.contact_github && (
              <a href={config.contact_github} target="_blank" className="flex items-center gap-4 font-mono text-xs text-[rgba(232,244,248,0.4)] px-4 py-3 border border-transparent hover:border-[rgba(0,212,255,0.2)] hover:text-accent transition-all">
                <span className="text-accent"><Github /></span>{config.contact_github}
              </a>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <Input label={t('İSİM', 'NAME')} placeholder={t('Adın Soyadın', 'Your Full Name')} value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
          <Input label={t('E-POSTA', 'EMAIL')} type="email" placeholder="mail@example.com" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
          <Textarea label={t('MESAJ', 'MESSAGE')} placeholder={t('Projenden bahset...', 'Tell me about your project...')} value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} />
          <Button onClick={handleSubmit} disabled={loading} className="mt-2">
            {loading ? t('Gönderiliyor...', 'Sending...') : t('Gönder →', 'Send →')}
          </Button>
        </div>
      </div>
    </section>
  )
}