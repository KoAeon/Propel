'use client'
import { useState } from 'react'
import { Sheet } from './Sheet'
import { Press } from '@/components/ui/Press'
import { Toggle } from '@/components/ui/Toggle'
import { Icon } from '@/components/ui/Icon'
import { T } from '@/lib/theme'
import { CAT_GLYPH } from '@/lib/seed'
import { useApp } from '@/context/AppContext'
import type { Reminder, ReminderFreq } from '@/lib/types'

const FONT_BODY = "'Manrope', system-ui, sans-serif"
const CATS = ['Renewal', 'Birthday', 'Financial', 'Health', 'Task'] as const
const FREQS: ReminderFreq[] = ['Once', 'Weekly', 'Fortnightly', 'Monthly', 'Yearly']

function daysFromDate(iso: string): number {
  if (!iso) return 30
  const target = new Date(iso + 'T12:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / 86400000)
}

function formatDisplayDate(iso: string, time: string): string {
  if (!iso) return 'No date set'
  const d = new Date(iso + 'T12:00:00')
  const datePart = d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  if (!time) return `${datePart} · 9:00am`
  const [h, m] = time.split(':').map(Number)
  const suffix = h >= 12 ? 'pm' : 'am'
  const h12 = h % 12 || 12
  return `${datePart} · ${h12}:${String(m).padStart(2, '0')}${suffix}`
}

function todayISO(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

interface Props {
  editId?: string
}

export function AddReminderSheet({ editId }: Props) {
  const { closeSheet, addReminder, editReminder, reminders } = useApp()
  const existing = editId ? reminders.find(r => r.id === editId) : undefined

  const [title, setTitle] = useState(existing?.title ?? '')
  const [date, setDate] = useState(existing?.date ?? '')
  const [time, setTime] = useState(existing?.time ?? '')
  const [cat, setCat] = useState<typeof CATS[number]>(existing?.cat ?? 'Renewal')
  const [freq, setFreq] = useState<ReminderFreq>(existing?.freq ?? 'Once')
  const [auto, setAuto] = useState(true)

  const days = date ? daysFromDate(date) : null
  const ok = title.trim().length > 0

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', padding: '13px 15px', borderRadius: 14,
    background: T.surface2, border: `1px solid ${T.border}`,
    color: T.text, fontFamily: FONT_BODY, fontSize: 15, outline: 'none',
    colorScheme: 'dark',
  }

  const handleSave = () => {
    if (!ok) return
    const sub = formatDisplayDate(date, time)
    const reminder: Omit<Reminder, 'id'> = {
      glyph: CAT_GLYPH[cat],
      title: title.trim(),
      sub,
      days: days ?? 365,
      date: date || undefined,
      time: time || undefined,
      freq,
      cat,
    }
    if (editId) {
      editReminder(editId, reminder)
    } else {
      addReminder(reminder)
    }
  }

  return (
    <Sheet onClose={closeSheet} title={editId ? 'Edit Reminder' : 'New Reminder'}>
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
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <input
              type="date"
              value={date}
              min={todayISO()}
              onChange={e => setDate(e.target.value)}
              style={{ ...inputStyle, flex: 1 }}
            />
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              style={{ ...inputStyle, width: 120, flex: 'none' }}
            />
          </div>
          {date && days !== null && (
            <div style={{ fontSize: 12, color: days <= 7 ? T.a3 : T.good, marginTop: 6, fontWeight: 600 }}>
              {days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `${days} days away`}
              {!time && <span style={{ color: T.dim, fontWeight: 400 }}> · defaults to 9:00am</span>}
            </div>
          )}
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.3, textTransform: 'uppercase', color: T.dim }}>
            Frequency
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            {FREQS.map(f => (
              <Press
                key={f}
                onClick={() => setFreq(f)}
                scale={0.95}
                style={{
                  padding: '8px 13px', borderRadius: 999, fontSize: 12.5, fontWeight: 700,
                  background: freq === f ? T.grad : T.surface2,
                  color: freq === f ? '#fff' : T.dim,
                  border: `1px solid ${freq === f ? 'transparent' : T.border}`,
                  boxShadow: freq === f ? T.glow : 'none',
                }}
              >{f}</Press>
            ))}
          </div>
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
            <div style={{ fontSize: 11.5, color: T.dim }}>Nudge 7 days before + day-of</div>
          </div>
          <Toggle on={auto} onClick={() => setAuto(!auto)} />
        </div>

        <Press
          onClick={handleSave}
          scale={0.97}
          style={{
            marginTop: 4, padding: 15, borderRadius: 16, textAlign: 'center',
            fontWeight: 700, fontSize: 15,
            background: ok ? T.grad : T.surface2,
            color: ok ? '#fff' : T.faint,
            boxShadow: ok ? T.glow : 'none',
          }}
        >
          {editId ? 'Save changes' : 'Add reminder'}
        </Press>
      </div>
    </Sheet>
  )
}
