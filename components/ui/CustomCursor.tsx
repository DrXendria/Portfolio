'use client'
import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px'
        dotRef.current.style.top = e.clientY + 'px'
      }
    }
    window.addEventListener('mousemove', onMove)

    let raf: number
    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12
      ring.current.y += (pos.current.y - ring.current.y) * 0.12
      if (ringRef.current) {
        ringRef.current.style.left = ring.current.x + 'px'
        ringRef.current.style.top = ring.current.y + 'px'
      }
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    const addHover = () => {
      dotRef.current?.classList.add('scale-50')
      ringRef.current?.classList.add('!w-14', '!h-14')
    }
    const removeHover = () => {
      dotRef.current?.classList.remove('scale-50')
      ringRef.current?.classList.remove('!w-14', '!h-14')
    }
    document.querySelectorAll('a,button,input,textarea,[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', addHover)
      el.addEventListener('mouseleave', removeHover)
    })

    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  return (
    <>
      <div ref={dotRef} className="fixed z-[9999] pointer-events-none w-2.5 h-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent transition-transform duration-100"
        style={{ boxShadow: '0 0 12px #00d4ff, 0 0 24px rgba(0,212,255,0.4)' }} />
      <div ref={ringRef} className="fixed z-[9998] pointer-events-none w-9 h-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(0,212,255,0.5)] transition-[width,height] duration-200" />
    </>
  )
}
