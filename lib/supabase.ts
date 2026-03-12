// Sadece tip tanımları — runtime'da kullanılmaz
export type Project = {
  id: string
  title: string
  title_en: string
  description: string
  description_en: string
  long_description: string
  long_description_en: string
  tech_stack: string[]
  live_url: string
  github_url: string
  image_url: string
  featured: boolean
  order_index: number
}

export type BlogPost = {
  id: string
  slug: string
  title: string
  title_en: string
  excerpt: string
  excerpt_en: string
  content: string
  content_en: string
  tags: string[]
  published: boolean
  published_at: string
  cover_image: string
}

export type Skill = {
  id: string
  name: string
  category: string
  category_en: string
  icon: string
  level: number
  order_index: number
}