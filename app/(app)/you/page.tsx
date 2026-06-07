'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useApp } from '@/context/AppContext'
import { Card } from '@/components/ui/Card'
import { Ring } from '@/components/ui/Ring'
import { Avatar } from '@/components/ui/Avatar'
import { GoogleCalendarConnect } from '@/components/GoogleCalendarConnect'
import { Press } from '@/components/ui/Press'
import { T } from '@/lib/theme'

const FONT_DISPLAY = "'Space Grotesk', 'Manrope', system-ui, sans-serif"

function daysUntilBirthday(dob: string): { date: string; days: number } {
  const d = new Date(dob + 'T12:00:00')
  const today = new Date(); today.setHours(0, 0, 0, 0)
  let next = new Date(today.getFullYear(), d.getMonth(), d.getDate())
  if (next < today) next = new Date(today.getFullYear() + 1, d.getMonth(), d.getDate())
  const days = Math.round((next.getTime() - today.getTime()) / 86400000)
  const date = next.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
  return { date, days }
}

export default function You() {
  const { habits, people, cloudSyncNeeded, syncToCloud, dbLoading } = useApp()
  const { status: sessionStatus } = useSession()
  const [syncing, setSyncing] = useState(false)
  const bestStreak = habits.length ? Math.max(...habits.map(h => h.streak)) : 0
  const birthdays = people
    .filter(p => p.dob)
    .map(p => ({ name: p.name, ...daysUntilBirthday(p.dob!) }))
    .sort((a, b) => a.days - b.days)

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

      {/* Profile */}
      <Card pad={18} radius={22} glow style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
        <Avatar initial="R" size={56} />
        <div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 700, color: T.text }}>Rich</div>
          <div style={{ fontSize: 12.5, color: T.dim }}>
            Propelling since 2026 · {bestStreak}-day best streak 🔥
          </div>
        </div>
      </Card>

      {/* Cloud sync status */}
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 700, color: T.text, letterSpacing: -.3, margin: '22px 2px 12px' }}>
        Cloud Sync
      </div>
      <Card pad={14} radius={16} style={{ marginBottom: cloudSyncNeeded ? 8 : 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 22 }}>{sessionStatus === 'authenticated' ? '☁️' : '💾'}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>
              {sessionStatus === 'authenticated' ? 'Supabase · Active' : 'Local storage only'}
            </div>
            <div style={{ fontSize: 12, color: T.dim, marginTop: 1 }}>
              {sessionStatus === 'authenticated'
                ? dbLoading ? 'Loading data…' : 'Data syncs across all your devices'
                : 'Sign in with Google to enable cloud sync'}
            </div>
          </div>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: sessionStatus === 'authenticated' ? T.good : T.warn, flexShrink: 0 }} />
        </div>
      </Card>
      {cloudSyncNeeded && (
        <Press onClick={async () => { setSyncing(true); await syncToCloud(); setSyncing(false) }} scale={0.97}>
          <Card pad={14} radius={16} style={{ background: T.grad, boxShadow: T.glow }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 20 }}>⬆️</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>
                  {syncing ? 'Uploading…' : 'Upload device data to cloud'}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.7)', marginTop: 1 }}>
                  Migrate your local data to Supabase
                </div>
              </div>
            </div>
          </Card>
        </Press>
      )}

      {/* Google Calendar — live integration */}
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 700, color: T.text, letterSpacing: -.3, margin: '22px 2px 12px' }}>
        Integrations
      </div>
      <GoogleCalendarConnect />

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

      {/* Important dates */}
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 700, color: T.text, letterSpacing: -.3, margin: '22px 2px 12px' }}>
        Important Dates
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {birthdays.map(b => (
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
        {birthdays.length === 0 && (
          <div style={{ padding: '20px 0', textAlign: 'center', color: T.faint, fontSize: 13 }}>
            Add birthdays in People to see them here
          </div>
        )}
      </div>
    </div>
  )
}
