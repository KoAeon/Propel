'use client'
import { T } from '@/lib/theme'
import { Press } from '@/components/ui/Press'
import type { ReactNode } from 'react'

const FONT_DISPLAY = "'Space Grotesk', 'Manrope', system-ui, sans-serif"

interface SheetProps {
  title: string
  children: ReactNode
  onClose: () => void
  right?: ReactNode
}

export function Sheet({ title, children, onClose, right }: SheetProps) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute', inset: 0, zIndex: 50,
        background: 'rgba(6,5,14,.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        animation: 'pl-fade .2s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#15121f',
          borderTopLeftRadius: 28, borderTopRightRadius: 28,
          borderTop: `1px solid ${T.border}`,
          padding: '12px 20px 26px',
          maxHeight: '88%', overflowY: 'auto',
          animation: 'pl-up .26s cubic-bezier(.2,.8,.2,1)',
          boxShadow: '0 -20px 60px rgba(0,0,0,.5)',
        }}
      >
        <div style={{ width: 40, height: 5, borderRadius: 3, background: T.border, margin: '0 auto 14px' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 700, color: T.text }}>{title}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {right}
            <Press onClick={onClose} scale={0.9}
              style={{ width: 30, height: 30, borderRadius: 15, background: T.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.dim, fontSize: 17 }}>
              ✕
            </Press>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
