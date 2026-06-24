'use client'
import { useState } from 'react'
import { Sheet } from '@/components/sheets/Sheet'
import { Press } from '@/components/ui/Press'
import { T } from '@/lib/theme'
import { useApp } from '@/context/AppContext'
import { HEALTH_ACTIVITIES } from '@/lib/seed'
import type { HealthActivity } from '@/lib/types'

const FONT_BODY = "'Manrope', system-ui, sans-serif"

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function paceLabel(distance: number, minutes: number) {
  if (!distance || !minutes) return null
  const perKm = minutes / distance
  const m = Math.floor(perKm)
  const s = Math.round((perKm - m) * 60)
  return `${m}:${String(s).padStart(2, '0')} /km`
}

interface Props { editId?: string; healthType?: string }

export function HealthSheet({ editId, healthType }: Props) {
  const { closeSheet, health, addHealth, editHealth } = useApp()
  const existing = editId ? health.find(h => h.id === editId) : undefined

  const [type, setType] = useState(existing?.type ?? healthType ?? HEALTH_ACTIVITIES[0].type)
  const [date, setDate] = useState(existing?.date ?? todayISO())
  const [minutes, setMinutes] = useState<number>(existing?.minutes ?? 30)
  const [distance, setDistance] = useState<string>(existing?.distance != null ? String(existing.distance) : '')
  const [calories, setCalories] = useState<string>(existing?.calories != null ? String(existing.calories) : '')
  const [notes, setNotes] = useState(existing?.notes ?? '')

  const activity = HEALTH_ACTIVITIES.find(a => a.type === type)
  const showDist = activity?.dist ?? false
  const distNum = parseFloat(distance)
  const ok = type.trim().length > 0 && minutes > 0

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 12,
    background: T.surface2, border: `1px solid ${T.border}`,
    color: T.text, fontFamily: FONT_BODY, fontSize: 14, outline: 'none', colorScheme: 'dark',
  }

  const handleSave = () => {
    if (!ok) return
    const entry: Omit<HealthActivity, 'id'> = {
      type, date, minutes,
      distance: showDist && distance ? distNum : undefined,
      calories: calories ? parseInt(calories, 10) : undefined,
      notes: notes.trim() || undefined,
    }
    if (editId) editHealth(editId, entry)
    else addHealth(entry)
  }

  const label = (s: string) => (
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.dim, marginBottom: 8 }}>{s}</div>
  )

  const pace = showDist && !isNaN(distNum) ? paceLabel(distNum, minutes) : null

  return (
    <Sheet onClose={closeSheet} title={editId ? 'Edit Activity' : 'Log Activity'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontFamily: FONT_BODY }}>

        <div>
          {label('Activity')}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {HEALTH_ACTIVITIES.map(a => {
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

        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            {label('Duration (min)')}
            <input type="number" min={1} value={minutes}
              onChange={e => setMinutes(Math.max(0, parseInt(e.target.value || '0', 10)))}
              style={inputStyle} />
          </div>
          {showDist && (
            <div style={{ flex: 1 }}>
              {label('Distance (km)')}
              <input type="number" min={0} step="0.1" value={distance} placeholder="0.0"
                onChange={e => setDistance(e.target.value)} style={inputStyle} />
            </div>
          )}
        </div>

        {pace && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 12, background: T.surface2, border: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 15 }}>⚡</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.a1 }}>{pace}</span>
            <span style={{ fontSize: 12, color: T.dim }}>average pace</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            {label('Calories (optional)')}
            <input type="number" min={0} value={calories} placeholder="—"
              onChange={e => setCalories(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            {label('Date')}
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
          </div>
        </div>

        <textarea value={notes} onChange={e => setNotes(e.target.value)}
          placeholder="How did it go? (optional)" rows={2}
          style={{ ...inputStyle, resize: 'none', lineHeight: 1.5 }} />

        <Press onClick={handleSave} scale={0.97} style={{
          marginTop: 4, padding: 15, borderRadius: 16, textAlign: 'center',
          fontWeight: 700, fontSize: 15,
          background: ok ? T.grad : T.surface2,
          color: ok ? '#fff' : T.faint,
          boxShadow: ok ? T.glow : 'none',
        }}>
          {editId ? 'Save changes' : 'Log activity'}
        </Press>
      </div>
    </Sheet>
  )
}
