'use client'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { Press } from '@/components/ui/Press'
import { T } from '@/lib/theme'

const FONT_DISPLAY = "'Space Grotesk', 'Manrope', system-ui, sans-serif"
const FONT_BODY = "'Manrope', system-ui, sans-serif"
const REL_COLOR: Record<string, string> = { Family: T.a3, Friend: T.a1, Partner: T.a2, Colleague: T.good, Other: T.dim }
const INITIALS = (name: string) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

function formatDOB(dob?: string) {
  if (!dob) return null
  const d = new Date(dob + 'T12:00:00')
  const today = new Date()
  let nextBday = new Date(today.getFullYear(), d.getMonth(), d.getDate())
  if (nextBday < today) nextBday = new Date(today.getFullYear() + 1, d.getMonth(), d.getDate())
  const days = Math.round((nextBday.getTime() - today.setHours(0,0,0,0)) / 86400000)
  return { display: d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' }), days }
}

export default function People() {
  const router = useRouter()
  const { people, openSheet } = useApp()

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0 16px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.3, textTransform: 'uppercase', color: T.dim }}>Stay connected</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 700, letterSpacing: -.5, color: T.text, marginTop: 3 }}>People</div>
        </div>
        <Press onClick={() => openSheet({ type: 'add-person' })} scale={0.9}
          style={{ width: 38, height: 38, borderRadius: 12, background: T.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: T.glow }}>
          <Icon name="plus" size={20} color="#fff" sw={2.2} />
        </Press>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontFamily: FONT_BODY }}>
        {people.map(p => {
          const bday = formatDOB(p.dob)
          return (
            <Card key={p.id} pad={14} radius={18}>
              <Press onClick={() => router.push(`/people/${p.id}`)} scale={0.99}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 16, background: T.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: T.glow }}>
                    <span style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 800, color: '#fff' }}>{INITIALS(p.name)}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>{p.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: REL_COLOR[p.relationship] ?? T.dim }}>{p.relationship}</span>
                      {bday && <span style={{ fontSize: 11.5, color: T.dim }}>· 🎂 {bday.display}</span>}
                    </div>
                    {p.notes && <div style={{ fontSize: 12, color: T.faint, marginTop: 2 }}>{p.notes}</div>}
                  </div>
                  {bday && bday.days <= 30 && (
                    <div style={{ textAlign: 'center', padding: '6px 9px', borderRadius: 10, background: T.surface2, border: `1px solid ${T.border}` }}>
                      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 15, color: bday.days <= 7 ? T.a3 : T.text }}>{bday.days}</div>
                      <div style={{ fontSize: 9, fontWeight: 700, color: T.dim }}>DAYS</div>
                    </div>
                  )}
                  <Icon name="chevR" size={16} color={T.faint} />
                </div>
              </Press>
            </Card>
          )
        })}
        {people.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: T.faint, fontSize: 14 }}>
            No contacts yet — tap + to add one
          </div>
        )}
      </div>
    </div>
  )
}
