import { cn } from '@/lib/utils'

type Props = React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }

export default function Input({ label, error, className, ...rest }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="font-mono text-[9px] tracking-[4px] text-accent opacity-60">{label}</label>}
      <input
        className={cn(
          'bg-[rgba(0,212,255,0.03)] border border-[rgba(0,212,255,0.15)] text-[#e8f4f8] px-4 py-3 font-rajdhani text-sm outline-none transition-all duration-300 placeholder:text-[rgba(255,255,255,0.2)]',
          'focus:border-[rgba(0,212,255,0.5)] focus:shadow-[0_0_16px_rgba(0,212,255,0.08)]',
          'clip-cyber-sm',
          error && 'border-red-500',
          className
        )}
        {...rest}
      />
      {error && <span className="font-mono text-[10px] text-red-400">{error}</span>}
    </div>
  )
}