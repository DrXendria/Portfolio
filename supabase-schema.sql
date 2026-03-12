-- Run this in Supabase SQL Editor

-- Projects
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  long_description text,
  tech_stack text[] default '{}',
  live_url text,
  github_url text,
  image_url text,
  featured boolean default false,
  order_index int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Blog Posts
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null default '',
  cover_image text,
  tags text[] default '{}',
  published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Skills
create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'Frontend',
  level int not null default 80,
  order_index int default 0,
  created_at timestamptz default now()
);

-- Messages
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- Site Config
create table if not exists site_config (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text not null default '',
  updated_at timestamptz default now()
);

-- RLS: public read for portfolio data
alter table projects enable row level security;
alter table blog_posts enable row level security;
alter table skills enable row level security;
alter table messages enable row level security;
alter table site_config enable row level security;

create policy "Public read projects" on projects for select using (true);
create policy "Public read published posts" on blog_posts for select using (published = true);
create policy "Public read skills" on skills for select using (true);
create policy "Public read config" on site_config for select using (true);
create policy "Public insert messages" on messages for insert with check (true);

-- Seed default config
insert into site_config (key, value) values
  ('hero_name', 'ADI'),
  ('hero_surname', 'SOYADI'),
  ('hero_title', 'FULL STACK DEVELOPER'),
  ('hero_desc', 'Kullanıcı odaklı dijital deneyimler tasarlıyor, ölçeklenebilir backend sistemleri kuruyorum.'),
  ('about_text', 'Merhaba! Ben bir Full Stack Developer olarak React, Next.js ve Laravel ile çalışıyorum.'),
  ('stat_projects', '12+'),
  ('stat_years', '5'),
  ('stat_clients', '8'),
  ('contact_desc', 'Yeni bir proje mi planlıyorsun? Her türlü konuşmaya açığım.'),
  ('contact_email', 'mail@example.com'),
  ('contact_github', 'https://github.com/kullanici'),
  ('contact_linkedin', 'https://linkedin.com/in/kullanici')
on conflict (key) do nothing;

-- Seed sample skills
insert into skills (name, category, level, order_index) values
  ('React / Next.js', 'Frontend', 92, 1),
  ('TypeScript', 'Frontend', 78, 2),
  ('Tailwind CSS', 'Frontend', 88, 3),
  ('Laravel / PHP', 'Backend', 88, 1),
  ('Node.js', 'Backend', 80, 2),
  ('PostgreSQL', 'Veritabanı', 85, 1),
  ('Redis', 'Veritabanı', 65, 2),
  ('Docker', 'DevOps', 65, 1)
on conflict do nothing;
