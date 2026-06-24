'use client'
import { useState } from 'react'
import { Sheet } from '@/components/sheets/Sheet'
import { Press } from '@/components/ui/Press'
import { T } from '@/lib/theme'
import { useApp } from '@/context/AppContext'
import { PEACE_ACTIVITIES, PEACE_MOODS } from '@/lib/seed'
import type { PeaceSession } from '@/lib/types'

const FONT_BODY = "'Manrope', system-ui, sans-serif"
const MINUTE_PRESETS = [5, 10, 15, 20, 30, 45]

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

interface Props { editId?: string; peaceType?: string }

export function PeaceSheet({ editId, peaceType }: Props) {
  const { closeSheet, peace, addPeace, editPeace } = useApp()
  const existing = editId ? peace.find(p => p.id === editId) : undefined

  const [type, setType] = useState(existing?.type ?? peaceType ?? PEACE_ACTIVITIES[0].type)
  const [date, setDate] = useState(existing?.date ?? todayISO())
  const [minutes, setMinutes] = useState<number>(existing?.minutes ?? 10)
  const [mood, setMood] = useState(existing?.mood ?? '')
  const [notes, setNotes] = useState(existing?.notes ?? '')

  const ok = type.trim().length > 0 && minutes > 0

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 12,
    background: T.surface2, border: `1px solid ${T.border}`,
    color: T.text, fontFamily: FONT_BODY, fontSize: 14, outline: 'none', colorScheme: 'dark',
  }

  const handleSave = () => {
    if (!ok) return
    const entry: Omit<PeaceSession, 'id'> = {
      type, date, minutes,
      mood: mood || undefined,
      notes: notes.trim() || undefined,
    }
    if (editId) editPeace(editId, entry)
    else addPeace(entry)
  }

  const label = (s: string) => (
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.dim, marginBottom: 8 }}>{s}</div>
  )

  return (
    <Sheet onClose={closeSheet} title={editId ? 'Edit Session' : 'Log Peacefulness'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontFamily: FONT_BODY }}>

        <div>
          {label('Activity')}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {PEACE_ACTIVITIES.map(a => {
              const sel = type === a.type
              return (
                <Press key={a.type} onClick={() => setType(a.type)} scale={0.95} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 12px', borderRadius: 20, fontSize: 12.5, fontWeight: 700,
                  background: sel ? T.grad : T.surface2,
                  color: sel ? '#fff' : T.dim,
                  border: `1px solid ${sel ? 'transparent' : T.border}`,
                  boxShadow: sel ? T.glow : 'none',
                }}>
                  <span style={{ fontSize: 14 }}>{a.glyph}</span>{a.type}
                </Press>
              )
            })}
          </div>
        </div>

        <div>
          {label('Minutes')}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {MINUTE_PRESETS.map(m => {
              const sel = minutes === m
              return (
                <Press key={m} onClick={() => setMinutes(m)} scale={0.95} style={{
                  minWidth: 46, padding: '9px 0', textAlign: 'center', borderRadius: 12, fontSize: 13.5, fontWeight: 700,
                  background: sel ? T.surface2 : 'transparent',
                  color: sel ? T.a1 : T.dim,
                  border: `1px solid ${sel ? T.a1 + '88' : T.border}`,
                }}>{m}</Press>
              )
            })}
            <input type="number" min={1} value={minutes}
              onChange={e => setMinutes(Math.max(0, parseInt(e.target.value || '0', 10)))}
              style={{ ...inputStyle, width: 80, flex: 'none' }} />
          </div>
        </div>

        <div>
          {label('How you felt (optional)')}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {PEACE_MOODS.map(m => {
              const sel = mood === m
              return (
                <Press key={m} onClick={() => setMood(sel ? '' : m)} scale={0.95} style={{
                  padding: '7px 13px', borderRadius: 20, fontSize: 12.5, fontWeight: 700,
                  background: sel ? T.surface2 : 'transparent',
                  color: sel ? T.a2 : T.dim,
                  border: `1px solid ${sel ? T.a2 + '88' : T.border}`,
                }}>{m}</Press>
              )
            })}
          </div>
        </div>

        <div>
          {label('Date')}
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
        </div>

        <textarea value={notes} onChange={e => setNotes(e.target.value)}
          placeholder="Notes / a thought to remember (optional)" rows={2}
          style={{ ...inputStyle, resize: 'none', lineHeight: 1.5 }} />

        <Press onClick={handleSave} scale={0.97} style={{
          marginTop: 4, padding: 15, borderRadius: 16, textAlign: 'center',
          fontWeight: 700, fontSize: 15,
          background: ok ? T.grad : T.surface2,
          color: ok ? '#fff' : T.faint,
          boxShadow: ok ? T.glow : 'none',
        }}>
          {editId ? 'Save changes' : 'Log session'}
        </Press>
      </div>
    </Sheet>
  )
}
