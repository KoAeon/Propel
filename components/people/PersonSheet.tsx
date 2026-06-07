'use client'
import { useState } from 'react'
import { Sheet } from '@/components/sheets/Sheet'
import { Press } from '@/components/ui/Press'
import { T } from '@/lib/theme'
import { useApp } from '@/context/AppContext'
import type { Person, Relationship } from '@/lib/people'

const FONT_BODY = "'Manrope', system-ui, sans-serif"
const RELATIONSHIPS: Relationship[] = ['Family', 'Friend', 'Partner', 'Colleague', 'Other']
const REL_COLOR: Record<Relationship, string> = { Family: T.a3, Friend: T.a1, Partner: T.a2, Colleague: T.good, Other: T.dim }

interface Props { editId?: string }

function nextBirthday(dob: string): { iso: string; days: number } {
  const d = new Date(dob + 'T12:00:00')
  const today = new Date(); today.setHours(0, 0, 0, 0)
  let next = new Date(today.getFullYear(), d.getMonth(), d.getDate())
  if (next < today) next = new Date(today.getFullYear() + 1, d.getMonth(), d.getDate())
  const days = Math.round((next.getTime() - today.getTime()) / 86400000)
  const iso = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`
  return { iso, days }
}

export function PersonSheet({ editId }: Props) {
  const { closeSheet, people, reminders, addPerson, editPerson, addReminder, editReminder } = useApp()
  const existing = editId ? people.find(p => p.id === editId) : undefined

  // Find an existing birthday reminder for this person (matched by title)
  const existingBdayReminder = editId && existing
    ? reminders.find(r => r.cat === 'Birthday' && r.title === `${existing.name}'s Birthday`)
    : undefined

  const [name, setName] = useState(existing?.name ?? '')
  const [rel, setRel] = useState<Relationship>(existing?.relationship ?? 'Friend')
  const [phone, setPhone] = useState(existing?.phone ?? '')
  const [email, setEmail] = useState(existing?.email ?? '')
  const [dob, setDob] = useState(existing?.dob ?? '')
  const [notes, setNotes] = useState(existing?.notes ?? '')
  const [addBdayReminder, setAddBdayReminder] = useState(!!existingBdayReminder)

  const ok = name.trim().length > 0

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 12,
    background: T.surface2, border: `1px solid ${T.border}`,
    color: T.text, fontFamily: FONT_BODY, fontSize: 14, outline: 'none', colorScheme: 'dark',
  }

  const handleSave = () => {
    if (!ok) return
    const trimmedName = name.trim()
    const person: Omit<Person, 'id'> = {
      name: trimmedName, relationship: rel,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      dob: dob || undefined,
      notes: notes.trim() || undefined,
      reminders: existing?.reminders ?? [],
    }
    if (editId) {
      editPerson(editId, person)
      if (addBdayReminder && dob) {
        const { iso, days } = nextBirthday(dob)
        const display = new Date(iso + 'T12:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
        if (existingBdayReminder) {
          editReminder(existingBdayReminder.id, { title: `${trimmedName}'s Birthday`, sub: `${display} · yearly`, days, date: iso })
        } else {
          addReminder({ glyph: '🎂', title: `${trimmedName}'s Birthday`, sub: `${display} · yearly`, days, date: iso, cat: 'Birthday' })
        }
      }
    } else {
      addPerson(person)
      if (addBdayReminder && dob) {
        const { iso, days } = nextBirthday(dob)
        const display = new Date(iso + 'T12:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
        addReminder({ glyph: '🎂', title: `${trimmedName}'s Birthday`, sub: `${display} · yearly`, days, date: iso, cat: 'Birthday' })
      }
    }
  }

  return (
    <Sheet onClose={closeSheet} title={editId ? 'Edit Contact' : 'New Contact'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily: FONT_BODY }}>

        <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name"
          autoFocus style={inputStyle} />

        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.dim, marginBottom: 8 }}>Relationship</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {RELATIONSHIPS.map(r => (
              <Press key={r} onClick={() => setRel(r)} scale={0.95} style={{
                padding: '7px 13px', borderRadius: 20, fontSize: 12.5, fontWeight: 700,
                background: rel === r ? T.surface2 : 'transparent',
                color: rel === r ? REL_COLOR[r] : T.dim,
                border: `1px solid ${rel === r ? REL_COLOR[r] + '66' : T.border}`,
              }}>{r}</Press>
            ))}
          </div>
        </div>

        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number"
          type="tel" style={inputStyle} />

        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address"
          type="email" style={inputStyle} />

        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.dim, marginBottom: 6 }}>Date of birth</div>
          <input type="date" value={dob} onChange={e => { setDob(e.target.value); if (e.target.value) setAddBdayReminder(true) }}
            style={inputStyle} />
        </div>

        {dob && (
          <Press onClick={() => setAddBdayReminder(v => !v)} scale={0.98} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12,
            background: addBdayReminder ? T.surface2 : 'transparent',
            border: `1px solid ${addBdayReminder ? T.a1 + '66' : T.border}`,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: 6, flexShrink: 0,
              background: addBdayReminder ? T.a1 : 'transparent',
              border: `2px solid ${addBdayReminder ? T.a1 : T.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all .15s ease',
            }}>
              {addBdayReminder && <span style={{ fontSize: 12, color: '#fff', lineHeight: 1 }}>✓</span>}
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: addBdayReminder ? T.text : T.dim }}>
                {existingBdayReminder ? 'Update birthday reminder 🎂' : 'Add birthday reminder 🎂'}
              </div>
              <div style={{ fontSize: 11.5, color: T.dim, marginTop: 1 }}>Repeats yearly</div>
            </div>
          </Press>
        )}

        <textarea value={notes} onChange={e => setNotes(e.target.value)}
          placeholder="Notes (optional)" rows={2}
          style={{ ...inputStyle, resize: 'none', lineHeight: 1.5 }} />

        <Press onClick={handleSave} scale={0.97} style={{
          marginTop: 4, padding: 15, borderRadius: 16, textAlign: 'center',
          fontWeight: 700, fontSize: 15,
          background: ok ? T.grad : T.surface2,
          color: ok ? '#fff' : T.faint,
          boxShadow: ok ? T.glow : 'none',
        }}>
          {editId ? 'Save changes' : 'Add contact'}
        </Press>
      </div>
    </Sheet>
  )
}
