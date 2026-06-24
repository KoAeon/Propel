'use client'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { Press } from '@/components/ui/Press'
import { T } from '@/lib/theme'
import { PEACE_ACTIVITIES } from '@/lib/seed'

const FONT_DISPLAY = "'Space Grotesk', 'Manrope', system-ui, sans-serif"
const FONT_BODY = "'Manrope', system-ui, sans-serif"

const ACT = Object.fromEntries(PEACE_ACTIVITIES.map(a => [a.type, a]))

function formatDate(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })
}

function daysAgoISO(n: number) {
  const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function Peace() {
  const router = useRouter()
  const { peace, openSheet, deletePeace } = useApp()

  const weekStart = daysAgoISO(6)
  const thisWeek = peace.filter(p => (p.date ?? '') >= weekStart)
  const weekMinutes = thisWeek.reduce((s, p) => s + (p.minutes || 0), 0)

  // Day streak: consecutive days (ending today or yesterday) with a session
  const dates = new Set(peace.map(p => p.date))
  let streak = 0
  for (let i = 0; i < 365; i++) {
    if (dates.has(daysAgoISO(i))) streak++
    else if (i === 0) continue // today not logged yet is OK
    else break
  }

  const stats: [string, string, string][] = [
    [String(thisWeek.length), 'Sessions / wk', T.a1],
    [String(weekMinutes), 'Minutes / wk', T.a2],
    [String(streak), 'Day streak', T.a3],
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0 16px' }}>
        <Press onClick={() => router.push('/modules')} scale={0.9} style={{ width: 38, height: 38, borderRadius: 12, background: T.surface, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="chevR" size={18} color={T.text} style={{ transform: 'scaleX(-1)' }} />
        </Press>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.3, textTransform: 'uppercase', color: T.dim }}>Find your calm</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 700, letterSpacing: -.5, color: T.text, marginTop: 3 }}>Peacefulness</div>
        </div>
        <Press onClick={() => openSheet({ type: 'add-peace' })} scale={0.9} style={{ width: 38, height: 38, borderRadius: 12, background: T.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: T.glow }}>
          <Icon name="plus" size={20} color="#fff" sw={2.2} />
        </Press>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 9, marginBottom: 4 }}>
        {stats.map(([val, lbl, col]) => (
          <Card key={lbl} pad={14} radius={18} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 700, fontStyle: 'italic', color: col }}>{val}</div>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.dim, marginTop: 3 }}>{lbl}</div>
          </Card>
        ))}
      </div>

      {/* Quick start */}
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 700, color: T.text, letterSpacing: -.3, margin: '20px 2px 10px' }}>Start a practice</div>
      <div style={{ display: 'flex', gap: 7, margin: '0 -18px', padding: '2px 18px', overflowX: 'auto' }}>
        {PEACE_ACTIVITIES.map(a => (
          <Press key={a.type} onClick={() => openSheet({ type: 'add-peace', peaceType: a.type })} scale={0.95} style={{
            flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 76, padding: '12px 6px',
            borderRadius: 16, background: T.surface, border: `1px solid ${T.border}`,
          }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: `linear-gradient(135deg, ${a.from}, ${a.to})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
              {a.glyph}
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: T.dim, textAlign: 'center', lineHeight: 1.2 }}>{a.type}</span>
          </Press>
        ))}
      </div>

      {/* Log */}
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 700, color: T.text, letterSpacing: -.3, margin: '22px 2px 10px' }}>Recent sessions</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontFamily: FONT_BODY }}>
        {peace.map(p => {
          const a = ACT[p.type]
          return (
            <Card key={p.id} pad={14} radius={18}>
              <Press onClick={() => openSheet({ type: 'edit-peace', id: p.id })} scale={0.99}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: a ? `linear-gradient(135deg, ${a.from}, ${a.to})` : T.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 19 }}>
                    {a?.glyph ?? '🧘'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 700, color: T.text }}>{p.type}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: T.a1 }}>{p.minutes} min</span>
                      <span style={{ fontSize: 11.5, color: T.dim }}>{formatDate(p.date)}</span>
                      {p.mood && (
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: T.a2, padding: '2px 8px', borderRadius: 999, background: T.surface2, border: `1px solid ${T.a2}44` }}>{p.mood}</span>
                      )}
                    </div>
                    {p.notes && <div style={{ fontSize: 12.5, color: T.faint, marginTop: 6, lineHeight: 1.5 }}>{p.notes}</div>}
                  </div>
                  <Press onClick={e => { e.stopPropagation(); deletePeace(p.id) }} scale={0.9}
                    style={{ width: 28, height: 28, borderRadius: 8, background: T.surface2, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name="trash" size={13} color={T.a3} />
                  </Press>
                </div>
              </Press>
            </Card>
          )
        })}
        {peace.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px 0', color: T.faint, fontSize: 14, lineHeight: 1.6 }}>
            No sessions yet.<br />Tap a practice above or + to log a moment of calm.
          </div>
        )}
      </div>
    </div>
  )
}
