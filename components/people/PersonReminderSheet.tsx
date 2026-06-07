'use client'
import { useState } from 'react'
import { Sheet } from '@/components/sheets/Sheet'
import { Press } from '@/components/ui/Press'
import { T } from '@/lib/theme'
import { useApp } from '@/context/AppContext'
import type { ReminderFreq } from '@/lib/people'

const FONT_BODY = "'Manrope', system-ui, sans-serif"
const FREQS: ReminderFreq[] = ['One-off', 'Weekly', 'Monthly', 'Every 3 months', 'Every 6 months', 'Yearly']

interface Props { personId: string }

export function PersonReminderSheet({ personId }: Props) {
  const { closeSheet, people, addPersonReminder, addReminder } = useApp()
  const person = people.find(p => p.id === personId)

  const [label, setLabel] = useState(person ? `Catch up with ${person.name}` : '')
  const [date, setDate] = useState('')
  const [freq, setFreq] = useState<ReminderFreq>('One-off')

  const ok = label.trim().length > 0

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 12,
    background: T.surface2, border: `1px solid ${T.border}`,
    color: T.text, fontFamily: FONT_BODY, fontSize: 14, outline: 'none', colorScheme: 'dark',
  }

  function daysFromDate(iso: string): number {
    if (!iso) return 30
    const target = new Date(iso + 'T12:00:00')
    const today = new Date(); today.setHours(0, 0, 0, 0)
    return Math.max(0, Math.round((target.getTime() - today.getTime()) / 86400000))
  }

  const handleSave = () => {
    if (!ok) return
    addPersonReminder(personId, { label: label.trim(), date: date || undefined, freq })
    // Also add to main reminders centre
    const days = date ? daysFromDate(date) : 30
    const sub = date ? new Date(date + 'T12:00:00').toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' }) : 'No date set'
    addReminder({
      glyph: freq === 'Yearly' ? '🎂' : '👤',
      title: label.trim(),
      sub: `${sub} · ${freq.toLowerCase()}`,
      days,
      date: date || undefined,
      cat: 'Birthday',
    })
    closeSheet()
  }

  return (
    <Sheet onClose={closeSheet} title="Add Reminder">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily: FONT_BODY }}>

        <input value={label} onChange={e => setLabel(e.target.value)}
          placeholder="What's the reminder?" autoFocus style={inputStyle} />

        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.dim, marginBottom: 6 }}>Date</div>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.dim, marginBottom: 8 }}>Frequency</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {FREQS.map(f => (
              <Press key={f} onClick={() => setFreq(f)} scale={0.98} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '11px 14px', borderRadius: 12,
                background: freq === f ? T.surface2 : 'transparent',
                border: `1px solid ${freq === f ? T.a1 + '66' : T.border}`,
              }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: freq === f ? T.text : T.dim }}>{f}</span>
                {freq === f && <span style={{ fontSize: 12, color: T.a1 }}>✓</span>}
              </Press>
            ))}
          </div>
        </div>

        <Press onClick={handleSave} scale={0.97} style={{
          marginTop: 4, padding: 15, borderRadius: 16, textAlign: 'center',
          fontWeight: 700, fontSize: 15,
          background: ok ? T.grad : T.surface2,
          color: ok ? '#fff' : T.faint,
          boxShadow: ok ? T.glow : 'none',
        }}>
          Add reminder
        </Press>
      </div>
    </Sheet>
  )
}
