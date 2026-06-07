'use client'
import { useState } from 'react'
import { Sheet } from '@/components/sheets/Sheet'
import { Press } from '@/components/ui/Press'
import { T } from '@/lib/theme'
import { useApp } from '@/context/AppContext'

const FONT_BODY = "'Manrope', system-ui, sans-serif"

const GRAD_PRESETS = [
  { from: '#7C6BFF', to: '#A98BFF' },
  { from: '#5B8DEF', to: '#9B6BFF' },
  { from: '#3FA9F5', to: '#5BD0E8' },
  { from: '#4FB477', to: '#7FD89B' },
  { from: '#E0716B', to: '#FF9D8A' },
  { from: '#E0A93B', to: '#FF9D4D' },
  { from: '#6B8AFF', to: '#8FA9FF' },
  { from: '#FF6BC1', to: '#FF9BD2' },
]

interface Props { editId?: string }

export function HabitSheet({ editId }: Props) {
  const { closeSheet, habits, addHabit, editHabit } = useApp()
  const existing = editId ? habits.find(h => h.id === editId) : undefined

  const [name, setName] = useState(existing?.name ?? '')
  const [meta, setMeta] = useState(existing?.meta ?? '')
  const [glyph, setGlyph] = useState(existing?.glyph ?? '⭐')
  const [grad, setGrad] = useState({ from: existing?.from ?? GRAD_PRESETS[0].from, to: existing?.to ?? GRAD_PRESETS[0].to })

  const ok = name.trim().length > 0

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 12,
    background: T.surface2, border: `1px solid ${T.border}`,
    color: T.text, fontFamily: FONT_BODY, fontSize: 14, outline: 'none',
  }

  const handleSave = () => {
    if (!ok) return
    const data = { name: name.trim(), meta: meta.trim(), glyph, from: grad.from, to: grad.to, streak: existing?.streak ?? 0, done: existing?.done ?? false }
    if (editId) editHabit(editId, data)
    else addHabit(data)
  }

  return (
    <Sheet onClose={closeSheet} title={editId ? 'Edit Habit' : 'New Habit'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily: FONT_BODY }}>

        <input value={name} onChange={e => setName(e.target.value)}
          placeholder="Habit name (e.g. Morning Meditation)" autoFocus style={inputStyle} />

        <input value={meta} onChange={e => setMeta(e.target.value)}
          placeholder="Detail (e.g. 10 min, Daily goal)" style={inputStyle} />

        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.dim, marginBottom: 8 }}>Emoji</div>
          <input value={glyph} onChange={e => setGlyph(e.target.value)}
            placeholder="Paste an emoji" style={{ ...inputStyle, width: 80 }} />
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.dim, marginBottom: 8 }}>Colour</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {GRAD_PRESETS.map(p => {
              const selected = p.from === grad.from
              return (
                <Press key={p.from} onClick={() => setGrad(p)} scale={0.9} style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `linear-gradient(135deg, ${p.from}, ${p.to})`,
                  border: selected ? `2px solid ${T.text}` : '2px solid transparent',
                  boxShadow: selected ? `0 0 0 1px ${T.border}` : 'none',
                }}>{null}</Press>
              )
            })}
          </div>
        </div>

        <Press onClick={handleSave} scale={0.97} style={{
          marginTop: 4, padding: 15, borderRadius: 16, textAlign: 'center',
          fontWeight: 700, fontSize: 15,
          background: ok ? T.grad : T.surface2,
          color: ok ? '#fff' : T.faint,
          boxShadow: ok ? T.glow : 'none',
        }}>
          {editId ? 'Save changes' : 'Add habit'}
        </Press>
      </div>
    </Sheet>
  )
}
