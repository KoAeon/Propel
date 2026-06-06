'use client'
import { useApp } from '@/context/AppContext'
import { Card } from '@/components/ui/Card'
import { Ring } from '@/components/ui/Ring'
import { Avatar } from '@/components/ui/Avatar'
import { T } from '@/lib/theme'

const FONT_DISPLAY = "'Space Grotesk', 'Manrope', system-ui, sans-serif"

export default function You() {
  const { habits } = useApp()
  const bestStreak = Math.max(...habits.map(h => h.streak))

  return (
    <div>
      <div style={{ padding: '4px 0 16px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.3, textTransform: 'uppercase', color: T.dim }}>
          Profile & settings
        </div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 700, letterSpacing: -.5, color: T.text, marginTop: 3 }}>
          You
        </div>
      </div>

      {/* Profile card */}
      <Card pad={18} radius={22} glow style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
        <Avatar initial="R" size={56} />
        <div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 700, color: T.text }}>Rich</div>
          <div style={{ fontSize: 12.5, color: T.dim }}>
            Propelling since 2026 · {bestStreak}-day best streak 🔥
          </div>
        </div>
      </Card>

      {/* Connected services */}
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 700, color: T.text, letterSpacing: -.3, margin: '22px 2px 12px' }}>
        Connected
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {[
          { glyph: '📧', name: 'Gmail', detail: 'rich@gmail.com' },
          { glyph: '📅', name: 'Google Calendar', detail: 'Syncing reminders & tasks' },
        ].map(c => (
          <Card key={c.name} pad={14} radius={16} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
              {c.glyph}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{c.name}</div>
              <div style={{ fontSize: 12, color: T.dim }}>{c.detail}</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: T.good }}>Connected</span>
          </Card>
        ))}
      </div>

      {/* Vision */}
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 700, color: T.text, letterSpacing: -.3, margin: '22px 2px 12px' }}>
        Vision
      </div>
      <Card pad={16} radius={18} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Ring pct={62} size={54} stroke={6}>
          <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>62%</span>
        </Ring>
        <div>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: T.text }}>Financially free before 60</div>
          <div style={{ fontSize: 12, color: T.dim, marginTop: 2 }}>On track for age 57 🎉</div>
        </div>
      </Card>

      {/* Birthdays */}
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 700, color: T.text, letterSpacing: -.3, margin: '22px 2px 12px' }}>
        Important Dates
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {[
          { name: 'Zara', date: 'Jun 11', days: 5 },
          { name: 'Maddie', date: 'Mar 10', days: 277 },
          { name: 'Kiki', date: 'Dec 28', days: 205 },
        ].map(b => (
          <Card key={b.name} pad={14} radius={16} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: T.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: T.glow }}>
              🎂
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{b.name}'s Birthday</div>
              <div style={{ fontSize: 12, color: T.dim }}>{b.date}</div>
            </div>
            <div style={{ textAlign: 'center', padding: '6px 9px', borderRadius: 10, background: T.surface2, border: `1px solid ${T.border}` }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 15, color: b.days <= 30 ? T.a3 : T.text }}>{b.days}</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: T.dim }}>DAYS</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
