'use client'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { Card } from '@/components/ui/Card'
import { Ring } from '@/components/ui/Ring'
import { Tile } from '@/components/ui/Tile'
import { Logo } from '@/components/ui/Logo'
import { Avatar } from '@/components/ui/Avatar'
import { Icon } from '@/components/ui/Icon'
import { Press } from '@/components/ui/Press'
import { T } from '@/lib/theme'
import { reminderDays } from '@/lib/seed'

const FONT_DISPLAY = "'Space Grotesk', 'Manrope', system-ui, sans-serif"
const FONT_BODY = "'Manrope', system-ui, sans-serif"

export default function Home() {
  const router = useRouter()
  const { habits, reminders, toggleHabit } = useApp()

  const doneCount = habits.filter(h => h.done).length
  const pct = habits.length ? Math.round((doneCount / habits.length) * 100) : 0
  const upcoming = reminders.map(r => ({ ...r, days: reminderDays(r) })).sort((a, b) => a.days - b.days)
  const next = upcoming.find(r => r.days >= 0) ?? upcoming[0]
  const bestStreak = habits.length ? Math.max(...habits.map(h => h.streak)) : 0

  const today = new Date()
  const dayLabel = today.toLocaleDateString('en-AU', { weekday: 'long' })
  const dateLabel = today.toLocaleDateString('en-AU', { day: 'numeric', month: 'long' })

  // Build Mon–Sun week slots, estimating past-day counts from streaks
  const todayDow = today.getDay() // 0=Sun,1=Mon...6=Sat
  const daysFromMon = todayDow === 0 ? 6 : todayDow - 1 // Mon=0, Tue=1,...Sun=6
  const WEEK_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const days = WEEK_LABELS.map((label, i) => {
    const daysAgo = daysFromMon - i  // positive=past, 0=today, negative=future
    const isToday = daysAgo === 0
    const isFuture = daysAgo < 0
    let count: number | null = null
    if (isToday) {
      count = doneCount
    } else if (!isFuture) {
      // habits whose streak covers this past day (streak > daysAgo means done today and all days since)
      count = habits.filter(h => h.done && h.streak > daysAgo).length
    }
    return { label, count, isToday, isFuture }
  })

  const pastDays = days.filter(d => !d.isFuture)
  const weekDone = pastDays.reduce((sum, d) => sum + (d.count ?? 0), 0)
  const avgScore = habits.length && pastDays.length
    ? Math.round(pastDays.reduce((sum, d) => sum + (d.count ?? 0), 0) / (habits.length * pastDays.length) * 100)
    : 0

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 0 16px' }}>
        <Logo variant="row" scale={0.82} />
        <Press onClick={() => router.push('/you')} scale={0.92} style={{ position: 'relative' }}>
          <Avatar initial="R" size={42} />
          <div style={{ position: 'absolute', top: -1, right: -1, width: 13, height: 13, borderRadius: '50%', background: T.a3, border: '2px solid #0c0a16' }} />
        </Press>
      </div>

      {/* Greeting */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.3, textTransform: 'uppercase', color: T.dim }}>
          {dayLabel}, {dateLabel}
        </div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 30, fontWeight: 700, letterSpacing: -.8, color: T.text, marginTop: 4 }}>
          Hey, <span style={{ background: T.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Rich</span> 👋
        </div>
      </div>

      {/* Completion card */}
      <Card pad={20} radius={26} glow style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -30, top: -30, width: 150, height: 150, borderRadius: '50%', background: T.grad, opacity: .16, filter: 'blur(10px)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.3, textTransform: 'uppercase', color: T.dim }}>
              Today's Completion
            </div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 64, fontWeight: 700, letterSpacing: -3, lineHeight: 1, fontStyle: 'italic', color: T.text, marginTop: 6, transition: 'all .3s' }}>
              {pct}<span style={{ fontSize: 38 }}>%</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.good, marginTop: 6 }}>
              {doneCount} of {habits.length} habits done
            </div>
          </div>
          <Ring pct={pct} size={76} stroke={8}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 700, color: T.text }}>
              {doneCount}/{habits.length}
            </div>
          </Ring>
        </div>
        {/* Week completion numbers */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18 }}>
          {days.map(({ label, count, isToday, isFuture }, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: isToday ? T.a1 : T.faint }}>{label}</span>
              <div style={{
                width: 30, height: 30, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isToday ? T.grad : count !== null && count > 0 ? T.surface2 : 'transparent',
                border: isToday ? 'none' : `1px ${isFuture ? 'dashed' : 'solid'} ${T.border}`,
                boxShadow: isToday ? T.glow : 'none',
              }}>
                {isFuture
                  ? <span style={{ width: 4, height: 4, borderRadius: 2, background: T.faint, display: 'block' }} />
                  : <span style={{ fontSize: 11, fontWeight: 700, color: isToday ? '#fff' : T.dim }}>{count ?? 0}</span>
                }
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Next reminder */}
      {next && (
        <Press onClick={() => router.push('/reminders')} style={{ marginTop: 16 }}>
          <Card pad={13} radius={18} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Tile glyph={next.glyph} from={T.a1} to={T.a2} size={38} radius={11} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{next.title}</div>
              <div style={{ fontSize: 12, color: T.dim }}>{next.days < 0 ? 'just passed' : next.days === 0 ? 'today' : next.days === 1 ? 'tomorrow' : `in ${next.days} days`} · {next.sub}</div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.a1, padding: '5px 10px', borderRadius: 9, background: T.surface2, border: `1px solid ${T.border}` }}>
              View
            </div>
          </Card>
        </Press>
      )}

      {/* Habits section */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '22px 2px 12px' }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 700, color: T.text, letterSpacing: -.3 }}>Today's Habits</div>
        <Press onClick={() => router.push('/habits')} style={{ fontSize: 13, fontWeight: 700, color: T.a1 }}>Edit →</Press>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {habits.slice(0, 5).map(h => (
          <Press key={h.id} onClick={() => toggleHabit(h.id)} scale={0.99}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 13, padding: '11px 13px',
              background: h.done ? 'rgba(255,255,255,.05)' : T.surface,
              border: `1px solid ${T.border}`, borderRadius: 17,
              position: 'relative', overflow: 'hidden',
            }}>
              {h.done && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: T.grad }} />}
              <Tile glyph={h.glyph} from={h.from} to={h.to} size={42} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: T.text, letterSpacing: -.2 }}>{h.name}</div>
                <div style={{ fontSize: 12.5, color: T.dim, marginTop: 2 }}>
                  {h.meta}
                  {h.streak > 0 && <span style={{ color: T.warn, fontWeight: 600 }}> · 🔥 {h.streak} day</span>}
                </div>
              </div>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: h.done ? T.grad : 'transparent',
                border: h.done ? 'none' : `2px solid ${T.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: h.done ? T.glow : 'none',
                transition: 'all .2s ease',
              }}>
                {h.done && <Icon name="check" size={14} color="#fff" sw={2.6} />}
              </div>
            </div>
          </Press>
        ))}
      </div>

      {/* Week stats */}
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 700, color: T.text, letterSpacing: -.3, margin: '22px 2px 12px' }}>
        This Week
      </div>
      <div style={{ display: 'flex', gap: 9 }}>
        {[
          [String(weekDone), 'Habits Done', T.a1],
          [String(bestStreak), 'Best Streak', T.a2],
          [avgScore + '%', 'Avg Score', T.a3],
        ].map(([val, label, col]) => (
          <Card key={label} pad={14} radius={18} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 700, fontStyle: 'italic', color: col }}>{val}</div>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.dim, marginTop: 3 }}>{label}</div>
          </Card>
        ))}
      </div>
    </div>
  )
}
