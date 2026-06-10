'use client'
import { useState, useRef } from 'react'
import { Press } from '@/components/ui/Press'
import { Icon } from '@/components/ui/Icon'
import { T } from '@/lib/theme'
import { STATUS_ORDER, STATUS_COLOR } from '@/lib/seed'
import type { TaskStatus } from '@/lib/types'

const FONT_BODY = "'Manrope', system-ui, sans-serif"

interface StatusDropdownProps {
  value: TaskStatus
  onChange: (s: TaskStatus) => void
  small?: boolean
}

export function StatusDropdown({ value, onChange, small }: StatusDropdownProps) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const btnRef = useRef<HTMLDivElement>(null)

  const handleOpen = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect()
      setPos({ top: r.bottom + 6, left: r.left })
    }
    setOpen(o => !o)
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block', fontFamily: FONT_BODY }}>
      <div ref={btnRef}>
        <Press
          onClick={handleOpen}
          scale={0.96}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            minWidth: small ? 92 : 104,
            padding: small ? '6px 11px' : '7px 12px',
            borderRadius: 9,
            background: STATUS_COLOR[value],
            color: '#fff',
            fontSize: small ? 11.5 : 12.5,
            fontWeight: 700,
            boxShadow: '0 2px 8px ' + STATUS_COLOR[value] + '55',
          }}
        >
          {value}
          <svg width="9" height="9" viewBox="0 0 11 11" fill="none" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" style={{ opacity: .85 }}>
            <path d="M2 4l3.5 3.5L9 4" />
          </svg>
        </Press>
      </div>

      {open && (
        <>
          <div
            onClick={e => { e.stopPropagation(); setOpen(false) }}
            style={{ position: 'fixed', inset: 0, zIndex: 990 }}
          />
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: pos.top,
              left: pos.left,
              zIndex: 991,
              background: '#1b1726',
              border: `1px solid ${T.border}`,
              borderRadius: 12, padding: 5, minWidth: 156,
              boxShadow: '0 14px 40px rgba(0,0,0,.7)',
            }}
          >
            {STATUS_ORDER.map(s => (
              <Press
                key={s}
                onClick={() => { onChange(s as TaskStatus); setOpen(false) }}
                scale={0.98}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9, padding: '8px 9px',
                  borderRadius: 8,
                  background: s === value ? T.surface2 : 'transparent',
                }}
              >
                <span style={{ width: 9, height: 9, borderRadius: 3, background: STATUS_COLOR[s], flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: s === value ? 700 : 600, color: T.text }}>{s}</span>
                {s === value && <Icon name="check" size={13} color={T.a1} sw={2.6} style={{ marginLeft: 'auto' }} />}
              </Press>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
