'use client'
import { useState } from 'react'
import { Sheet } from './Sheet'
import { Press } from '@/components/ui/Press'
import { Toggle } from '@/components/ui/Toggle'
import { Icon } from '@/components/ui/Icon'
import { T } from '@/lib/theme'
import { daysUntil, CAT_GLYPH } from '@/lib/seed'
import { useApp } from '@/context/AppContext'
import type { Reminder } from '@/lib/types'

const FONT_BODY = "'Manrope', system-ui, sans-serif"
const CATS = ['Renewal', 'Birthday', 'Financial', 'Health'] as const

export function AddReminderSheet() {
  const { closeSheet, addReminder } = useApp()
  const [title, setTitle] = useState('')
  const [when, setWhen] = useState('')
  const [cat, setCat] = useState<typeof CATS[number]>('Renewal')
  const [auto, setAuto] = useState(true)

  const d = daysUntil(when)
  const ok = title.trim().length > 0

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', padding: '13px 15px', borderRadius: 14,
    background: T.surface2, border: `1px solid ${T.border}`,
    color: T.text, fontFamily: FONT_BODY, fontSize: 15, outline: 'none',
  }

  const handleAdd = () => {
    if (!ok) return
    const reminder: Omit<Reminder, 'id'> = {
      glyph: CAT_GLYPH[cat],
      title: title.trim(),
      sub: when ? `${when}${auto ? ' · auto' : ''}` : 'No date set',
      days: d == null ? 30 : d,
      cat,
    }
    addReminder(reminder)
  }

  return (
    <Sheet onClose={closeSheet} title="New Reminder">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontFamily: FONT_BODY }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.3, textTransform: 'uppercase', color: T.dim }}>
            What's the reminder?
          </div>
          <input
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Passport renewal"
            style={{ ...inputStyle, marginTop: 8 }}
          />
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.3, textTransform: 'uppercase', color: T.dim }}>
            When
          </div>
          <input
            value={when}
            onChange={e => setWhen(e.target.value)}
            placeholder='e.g. Nov 20'
            style={{ ...inputStyle, marginTop: 8 }}
          />
          {when && (
            <div style={{ fontSize: 12, color: d != null ? T.good : T.dim, marginTop: 6, fontWeight: 600 }}>
              {d != null ? `${d} days away` : 'Type a date like "Nov 20"'}
            </div>
          )}
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.3, textTransform: 'uppercase', color: T.dim }}>
            Category
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {CATS.map(c => (
              <Press
                key={c}
                onClick={() => setCat(c)}
                scale={0.95}
                style={{
                  padding: '9px 14px', borderRadius: 999, fontSize: 13, fontWeight: 700,
                  background: cat === c ? T.grad : T.surface2,
                  color: cat === c ? '#fff' : T.dim,
                  border: `1px solid ${cat === c ? 'transparent' : T.border}`,
                  boxShadow: cat === c ? T.glow : 'none',
                }}
              >
                <span style={{ marginRight: 5 }}>{CAT_GLYPH[c]}</span>{c}
              </Press>
            ))}
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '13px 15px',
          borderRadius: 14, background: T.surface2, border: `1px solid ${T.border}`,
        }}>
          <Icon name="bell" size={18} color={T.a1} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: T.text }}>Auto-remind me</div>
            <div style={{ fontSize: 11.5, color: T.dim }}>Nudge 30 & 7 days before</div>
          </div>
          <Toggle on={auto} onClick={() => setAuto(!auto)} />
        </div>
        <Press
          onClick={handleAdd}
          scale={0.97}
          style={{
            marginTop: 4, padding: 15, borderRadius: 16, textAlign: 'center',
            fontWeight: 700, fontSize: 15,
            background: ok ? T.grad : T.surface2,
            color: ok ? '#fff' : T.faint,
            boxShadow: ok ? T.glow : 'none',
          }}
        >
          Add reminder
        </Press>
      </div>
    </Sheet>
  )
}
