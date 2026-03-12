# 🚀 Cyber-Minimal Portfolio

Next.js 14 + Supabase ile oluşturulmuş, cyberpunk-minimal neon temalı portfolyo sitesi.

## Stack
- **Frontend:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + Custom CSS
- **Backend/DB:** Supabase (PostgreSQL + Auth)
- **Deploy:** Vercel veya Netlify

## Kurulum

### 1. Projeyi klonla & bağımlılıkları yükle
```bash
npm install
```

### 2. Supabase kurulumu
1. [supabase.com](https://supabase.com) üzerinden yeni proje oluştur
2. SQL Editor'a gidip `supabase-schema.sql` dosyasını çalıştır
3. Authentication > Users > "Add User" ile admin kullanıcısı oluştur

### 3. Environment variables
`.env.local` dosyasını düzenle:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_NAME="Adın Soyadın"
NEXT_PUBLIC_SITE_ROLE="Full Stack Developer"
```

### 4. Geliştirme sunucusunu başlat
```bash
npm run dev
```
Site: http://localhost:3000
Admin: http://localhost:3000/admin

## Deploy

### Vercel (Önerilen)
```bash
npx vercel
```
Environment variables'ları Vercel dashboard'ından ekle.

### Netlify
`netlify.toml` oluştur:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

## Admin Panel
- **URL:** `/admin/login`
- Supabase'deki kullanıcı bilgileriyle giriş yap
- Projeler, blog yazıları, yetenekler, mesajlar ve site ayarlarını yönet

## Klasör Yapısı
```
src/
├── app/
│   ├── (public)/          # Ziyaretçi sayfaları
│   │   ├── page.tsx       # Ana sayfa
│   │   ├── blog/          # Blog listesi + detay
│   │   └── projects/      # Proje detay sayfaları
│   ├── admin/             # Admin panel (korumalı)
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── posts/
│   │   ├── projects/
│   │   ├── skills/
│   │   ├── messages/
│   │   ├── settings/
│   │   └── cv/
│   └── api/               # API routes
├── components/
│   ├── ui/                # Genel UI bileşenleri
│   ├── layout/            # Navbar, Footer
│   ├── public/            # Sayfa bölümleri
│   └── admin/             # Admin bileşenleri
├── lib/
│   ├── supabase/          # Supabase clients
│   └── utils.ts
└── types/                 # TypeScript tipleri
```
