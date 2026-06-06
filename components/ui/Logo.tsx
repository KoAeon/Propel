import { T } from '@/lib/theme'

const FONT_DISPLAY = "'Space Grotesk', 'Manrope', system-ui, sans-serif"
const FONT_BODY = "'Manrope', system-ui, sans-serif"

interface LogoProps {
  variant?: 'row' | 'stack' | 'mark'
  scale?: number
}

export function Logo({ variant = 'row', scale = 1 }: LogoProps) {
  const s = scale
  const Mark = (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7 * s }}>
      <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 26 * s, letterSpacing: -.5, color: T.text, lineHeight: 1 }}>
        PML
      </span>
      <span style={{
        position: 'relative', width: 26 * s, height: 26 * s, flexShrink: 0,
        borderRadius: 8 * s, background: T.grad, boxShadow: T.glow,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width={15 * s} height={15 * s} viewBox="0 0 16 16" fill="none"
          stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 11.5L12 4M12 4H7M12 4V9" />
        </svg>
      </span>
    </div>
  )

  const Word = (
    <span style={{
      fontFamily: FONT_BODY, fontWeight: 600, fontSize: 10.5 * s,
      letterSpacing: 3 * s, textTransform: 'uppercase', color: T.dim, lineHeight: 1,
    }}>
      Propel&nbsp;My&nbsp;Life
    </span>
  )

  if (variant === 'mark') return Mark
  if (variant === 'stack') return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 7 * s }}>
      {Mark}{Word}
    </div>
  )
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 11 * s }}>
      {Mark}
      <div style={{ width: 1, height: 22 * s, background: T.border }} />
      {Word}
    </div>
  )
}
