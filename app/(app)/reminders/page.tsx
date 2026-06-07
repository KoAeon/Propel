'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { Card } from '@/components/ui/Card'
import { Tile } from '@/components/ui/Tile'
import { Icon } from '@/components/ui/Icon'
import { Press } from '@/components/ui/Press'
import { Toggle } from '@/components/ui/Toggle'
import { T } from '@/lib/theme'
import { REMINDER_CATS } from '@/lib/seed'

const FONT_DISPLAY = "'Space Grotesk', 'Manrope', system-ui, sans-serif"

export default function Reminders() {
  const router = useRouter()
  const { reminders, autoRemind, setAutoRemind, openSheet, deleteReminder } = useApp()
  const [filter, setFilter] = useState('All')

  const list = reminders.filter(r => filter === 'All' || r.cat === filter)
  const groups = [
    ['This Week', list.filter(r => r.days <= 9)],
    ['This Month', list.filter(r => r.days > 9 && r.days <= 31)],
    ['Later', list.filter(r => r.days > 31)],
  ] as [string, typeof list][]

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0 16px' }}>
        <Press onClick={() => router.push('/modules')} scale={0.9} style={{ width: 38, height: 38, borderRadius: 12, background: T.surface, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="chevR" size={18} color={T.text} style={{ transform: 'scaleX(-1)' }} />
        </Press>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.3, textTransform: 'uppercase', color: T.dim }}>Never miss what matters</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 700, letterSpacing: -.5, color: T.text, marginTop: 3 }}>Reminder Centre</div>
        </div>
        <Press onClick={() => openSheet({ type: 'reminder' })} scale={0.9} style={{ width: 38, height: 38, borderRadius: 12, background: T.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: T.glow }}>
          <Icon name="plus" size={20} color="#fff" sw={2.2} />
        </Press>
      </div>

      {/* Auto-remind toggle */}
      <Card pad={14} radius={18} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: T.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: T.glow }}>
          <Icon name="bell" size={19} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: T.text }}>Auto-reminders {autoRemind ? 'on' : 'off'}</div>
          <div style={{ fontSize: 12, color: T.dim }}>Nudge 7 days before each date</div>
        </div>
        <Toggle on={autoRemind} onClick={() => setAutoRemind(!autoRemind)} />
      </Card>

      {/* Category chips */}
      <div style={{ display: 'flex', gap: 7, margin: '0 -18px 6px', padding: '2px 18px', overflowX: 'auto' }}>
        {REMINDER_CATS.map(c => (
          <Press key={c} onClick={() => setFilter(c)} scale={0.95} style={{
            flexShrink: 0, padding: '8px 14px', borderRadius: 999,
            fontSize: 13, fontWeight: 700,
            background: filter === c ? T.grad : T.surface,
            color: filter === c ? '#fff' : T.dim,
            border: `1px solid ${filter === c ? 'transparent' : T.border}`,
            boxShadow: filter === c ? T.glow : 'none',
          }}>
            {c}
          </Press>
        ))}
      </div>

      {/* Reminder groups */}
      {groups.map(([label, items]) => items.length > 0 && (
        <div key={label}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 700, color: T.text, letterSpacing: -.3, margin: '22px 2px 12px' }}>
            {label}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {items.map(r => (
              <div key={r.id} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 13px',
                background: r.days <= 9 ? T.surface2 : T.surface,
                border: `1px solid ${r.days <= 9 ? T.a3 + '55' : T.border}`,
                borderRadius: 16,
              }}>
                <Tile glyph={r.glyph} from={T.a1} to={T.a2} size={40} radius={12} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: T.text }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: T.dim, marginTop: 2 }}>{r.sub}</div>
                  {autoRemind && (
                    <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                      {['−7d', 'day-of'].map(x => (
                        <span key={x} style={{ fontSize: 9.5, fontWeight: 700, color: T.dim, padding: '2px 6px', borderRadius: 6, background: T.surface, border: `1px solid ${T.border}` }}>
                          {x}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ textAlign: 'center', minWidth: 46, padding: '6px 9px', borderRadius: 12, background: T.surface, border: `1px solid ${T.border}` }}>
                    <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 17, color: r.days <= 9 ? T.a3 : T.text, lineHeight: 1 }}>{r.days}</div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: T.dim, marginTop: 2 }}>DAYS</div>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <Press
                      onClick={() => openSheet({ type: 'edit-reminder', id: r.id })}
                      scale={0.9}
                      style={{ width: 28, height: 28, borderRadius: 8, background: T.surface2, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Icon name="pencil" size={13} color={T.dim} />
                    </Press>
                    <Press
                      onClick={() => deleteReminder(r.id)}
                      scale={0.9}
                      style={{ width: 28, height: 28, borderRadius: 8, background: T.surface2, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Icon name="trash" size={13} color={T.a3} />
                    </Press>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {list.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: T.faint, fontSize: 14 }}>
          No reminders yet — tap + to add one
        </div>
      )}
    </div>
  )
}
