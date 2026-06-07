'use client'
import { useParams, useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { Press } from '@/components/ui/Press'
import { T } from '@/lib/theme'

const FONT_DISPLAY = "'Space Grotesk', 'Manrope', system-ui, sans-serif"
const FONT_BODY = "'Manrope', system-ui, sans-serif"
const REL_COLOR: Record<string, string> = { Family: T.a3, Friend: T.a1, Partner: T.a2, Colleague: T.good, Other: T.dim }
const INITIALS = (name: string) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

function formatDate(iso?: string) {
  if (!iso) return null
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function PersonDetail() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { people, openSheet, deletePerson, deletePersonReminder } = useApp()

  const person = people.find(p => p.id === id)
  if (!person) return null

  return (
    <div style={{ fontFamily: FONT_BODY }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0 16px' }}>
        <Press onClick={() => router.push('/people')} scale={0.9}
          style={{ width: 38, height: 38, borderRadius: 12, background: T.surface, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="chevR" size={18} color={T.text} style={{ transform: 'scaleX(-1)' }} />
        </Press>
        <div style={{ flex: 1 }} />
        <Press onClick={() => openSheet({ type: 'edit-person', id: person.id })} scale={0.9}
          style={{ width: 36, height: 36, borderRadius: 11, background: T.surface, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="pencil" size={15} color={T.dim} />
        </Press>
        <Press onClick={() => { deletePerson(person.id); router.push('/people') }} scale={0.9}
          style={{ width: 36, height: 36, borderRadius: 11, background: T.surface, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="trash" size={15} color={T.a3} />
        </Press>
      </div>

      {/* Profile card */}
      <Card pad={20} radius={22} glow style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
        <div style={{ width: 64, height: 64, borderRadius: 20, background: T.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: T.glow }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 800, color: '#fff' }}>{INITIALS(person.name)}</span>
        </div>
        <div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 700, color: T.text }}>{person.name}</div>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: REL_COLOR[person.relationship] ?? T.dim }}>{person.relationship}</span>
        </div>
      </Card>

      {/* Contact details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
        {person.phone && (
          <a href={`tel:${person.phone}`} style={{ textDecoration: 'none' }}>
            <Card pad={14} radius={14} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: T.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="phone" size={17} color={T.a1} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.dim, textTransform: 'uppercase', letterSpacing: .8 }}>Phone</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginTop: 1 }}>{person.phone}</div>
              </div>
            </Card>
          </a>
        )}
        {person.email && (
          <a href={`mailto:${person.email}`} style={{ textDecoration: 'none' }}>
            <Card pad={14} radius={14} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: T.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="mail" size={17} color={T.a2} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.dim, textTransform: 'uppercase', letterSpacing: .8 }}>Email</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginTop: 1 }}>{person.email}</div>
              </div>
            </Card>
          </a>
        )}
        {person.dob && (
          <Card pad={14} radius={14} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: T.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
              🎂
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.dim, textTransform: 'uppercase', letterSpacing: .8 }}>Birthday</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginTop: 1 }}>{formatDate(person.dob)}</div>
            </div>
          </Card>
        )}
      </div>

      {/* Notes */}
      {person.notes && (
        <>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 700, color: T.text, margin: '4px 2px 10px' }}>Notes</div>
          <Card pad={14} radius={14} style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 14, color: T.dim, lineHeight: 1.6 }}>{person.notes}</div>
          </Card>
        </>
      )}

      {/* Reminders */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '4px 2px 10px' }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 700, color: T.text }}>Reminders</div>
        <Press onClick={() => openSheet({ type: 'add-person-reminder', personId: person.id })} scale={0.9}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 10, background: T.grad, boxShadow: T.glow }}>
          <Icon name="plus" size={13} color="#fff" sw={2.2} />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Add</span>
        </Press>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {person.reminders.map(r => (
          <Card key={r.id} pad={14} radius={14} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 20 }}>🔔</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{r.label}</div>
              <div style={{ fontSize: 12, color: T.dim, marginTop: 2 }}>
                {r.date && new Date(r.date + 'T12:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                {r.date && ' · '}{r.freq}
              </div>
            </div>
            <Press onClick={() => deletePersonReminder(person.id, r.id)} scale={0.9}
              style={{ width: 28, height: 28, borderRadius: 8, background: T.surface2, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="trash" size={13} color={T.a3} />
            </Press>
          </Card>
        ))}
        {person.reminders.length === 0 && (
          <div style={{ padding: '20px 0', textAlign: 'center', color: T.faint, fontSize: 13 }}>
            No reminders set — tap Add to create one
          </div>
        )}
      </div>
    </div>
  )
}
