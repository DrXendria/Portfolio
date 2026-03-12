type Props = { index: string; title: string }
export default function SectionHeader({ index, title }: Props) {
  return (
    <div className="mb-14">
      <p className="font-mono text-[10px] tracking-[5px] text-accent opacity-60 mb-2">// {index}</p>
      <h2 className="font-orbitron text-3xl md:text-4xl font-black text-[#e8f4f8] relative inline-block
        after:content-[''] after:absolute after:left-0 after:-bottom-3 after:w-full after:h-px
        after:bg-gradient-to-r after:from-accent after:to-transparent after:shadow-neon-sm">
        {title}
      </h2>
    </div>
  )
}