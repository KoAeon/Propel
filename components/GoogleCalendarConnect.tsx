'use client'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useState } from 'react'
import { T } from '@/lib/theme'
import { Press } from '@/components/ui/Press'
import { Icon } from '@/components/ui/Icon'
import { useApp } from '@/context/AppContext'

const FONT_BODY = "'Manrope', system-ui, sans-serif"
const FONT_DISPLAY = "'Space Grotesk', 'Manrope', system-ui, sans-serif"

export function GoogleCalendarConnect() {
  const { data: session, status } = useSession()
  const { reminders, flash } = useApp()
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<{ synced: number } | null>(null)

  const isConnected = status === 'authenticated' && !session?.error
  const isLoading = status === 'loading'

  const handleSync = async () => {
    setSyncing(true)
    setSyncResult(null)
    try {
      const res = await fetch('/api/calendar/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reminders }),
      })
      const data = await res.json()
      if (res.ok || res.status === 207) {
        setSyncResult({ synced: data.synced })
        flash(`✓ ${data.synced} events added to Google Calendar`)
      } else {
        flash('Sync failed — try reconnecting Google')
      }
    } catch {
      flash('Sync failed — check your connection')
    } finally {
      setSyncing(false)
    }
  }

  if (isLoading) return (
    <div style={{ height: 72, borderRadius: 16, background: T.surface, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 13, color: T.faint }}>Loading…</div>
    </div>
  )

  if (!isConnected) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      <Press
        onClick={() => signIn('google', { callbackUrl: '/you' })}
        scale={0.97}
        style={{
          display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
          borderRadius: 16, background: T.surface2, border: `1px solid ${T.border}`,
          fontFamily: FONT_BODY,
        }}
      >
        <div style={{ width: 38, height: 38, borderRadius: 11, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <GoogleIcon />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Connect Google Calendar</div>
          <div style={{ fontSize: 12, color: T.dim }}>Sync reminders & important dates</div>
        </div>
        <Icon name="chevR" size={16} color={T.dim} />
      </Press>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      {/* Connected status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 16, background: T.surface, border: `1px solid ${T.border}` }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <GoogleIcon />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Google Calendar</div>
          <div style={{ fontSize: 12, color: T.dim }}>{session?.user?.email}</div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: T.good }}>Connected</span>
      </div>

      {/* Sync button */}
      <Press
        onClick={handleSync}
        scale={0.97}
        style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px',
          borderRadius: 16,
          background: syncing ? T.surface2 : T.grad,
          border: syncing ? `1px solid ${T.border}` : 'none',
          boxShadow: syncing ? 'none' : T.glow,
          fontFamily: FONT_BODY,
          opacity: syncing ? 0.7 : 1,
        }}
      >
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {syncing
            ? <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
            : <Icon name="cal" size={18} color="#fff" />}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>
            {syncing ? 'Syncing…' : syncResult ? `Synced ${syncResult.synced} events ✓` : 'Sync to Google Calendar'}
          </div>
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,.7)' }}>
            {reminders.length} reminders · 7-day nudges included
          </div>
        </div>
      </Press>

      {/* Disconnect */}
      <Press
        onClick={() => signOut({ callbackUrl: '/you' })}
        scale={0.96}
        style={{ padding: '10px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: T.faint }}
      >
        Disconnect Google
      </Press>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}
