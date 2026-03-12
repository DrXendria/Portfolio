import { cn } from '@/lib/utils'
import Link from 'next/link'

type Props = {
  children: React.ReactNode
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export default function Button({ children, variant = 'primary', size = 'md', href, className, ...rest }: Props) {
  const base = 'inline-flex items-center justify-center gap-2 font-mono tracking-widest transition-all duration-300 disabled:opacity-50'
  const sizes = { sm: 'px-4 py-2 text-[9px]', md: 'px-6 py-3 text-[10px]', lg: 'px-8 py-4 text-[11px]' }
  const variants = {
    primary: 'clip-btn bg-[rgba(0,212,255,0.08)] border border-accent text-accent hover:bg-accent hover:text-bg-base hover:shadow-neon',
    ghost: 'clip-btn bg-transparent border border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.4)] hover:border-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,0.7)]',
    danger: 'clip-btn bg-[rgba(255,50,50,0.08)] border border-red-500 text-red-400 hover:bg-red-500 hover:text-white',
  }
  const cls = cn(base, sizes[size], variants[variant], className)
  if (href) return <Link href={href} className={cls}>{children}</Link>
  return <button className={cls} {...rest}>{children}</button>
}