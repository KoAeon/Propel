import { T } from '@/lib/theme'

const FONT_DISPLAY = "'Space Grotesk', 'Manrope', system-ui, sans-serif"

export function Avatar({ initial = 'R', size = 46 }: { initial?: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: T.grad,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: size * 0.4, color: '#fff',
      boxShadow: T.glow, border: '1.5px solid rgba(255,255,255,.25)',
    }}>
      {initial}
    </div>
  )
}
