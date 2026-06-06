import { T } from '@/lib/theme'
import type { CSSProperties, ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  style?: CSSProperties
  pad?: number
  radius?: number
  glow?: boolean
}

export function Card({ children, style, pad = 16, radius = 22, glow = false }: CardProps) {
  return (
    <div style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: radius,
      padding: pad,
      boxShadow: glow ? T.glow : '0 1px 0 rgba(255,255,255,.04) inset',
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
      ...style,
    }}>
      {children}
    </div>
  )
}
