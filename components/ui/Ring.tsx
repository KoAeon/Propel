'use client'
import { useId } from 'react'
import { T } from '@/lib/theme'
import type { ReactNode } from 'react'

interface RingProps {
  pct: number
  size?: number
  stroke?: number
  children?: ReactNode
  track?: string
}

export function Ring({ pct, size = 62, stroke = 7, children, track }: RingProps) {
  const uid = useId()
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const off = c * (1 - Math.max(0, Math.min(1, pct / 100)))
  const gid = `rg${uid.replace(/:/g, '')}`

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={T.a1} />
            <stop offset="1" stopColor={T.a2} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track || T.border} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={`url(#${gid})`} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
      }}>
        {children}
      </div>
    </div>
  )
}
