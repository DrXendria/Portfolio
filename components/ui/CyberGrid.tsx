'use client'
export default function CyberGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 cyber-grid-bg"
      style={{ animation: 'gridScroll 25s linear infinite',
        transform: 'perspective(600px) rotateX(18deg)' }}>
      <style>{`
        @keyframes gridScroll {
          from { transform: perspective(600px) rotateX(18deg) translateY(0); }
          to   { transform: perspective(600px) rotateX(18deg) translateY(60px); }
        }
      `}</style>
    </div>
  )
}
