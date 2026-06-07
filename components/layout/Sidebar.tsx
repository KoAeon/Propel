'use client'
import { usePathname, useRouter } from 'next/navigation'
import { T } from '@/lib/theme'
import { Icon } from '@/components/ui/Icon'
import { Press } from '@/components/ui/Press'
import { useApp } from '@/context/AppContext'

const FONT_BODY = "'Manrope', system-ui, sans-serif"
const FONT_DISPLAY = "'Space Grotesk', 'Manrope', system-ui, sans-serif"

const NAV = [
  { icon: 'home',    label: 'Home',      path: '/home' },
  { icon: 'flame',   label: 'Habits',    path: '/habits' },
  { icon: 'bell',    label: 'Reminders', path: '/reminders' },
  { icon: 'doc',     label: 'Tasks',     path: '/tasks' },
  { icon: 'folder',  label: 'Projects',  path: '/projects' },
  { icon: 'user',    label: 'People',    path: '/people' },
  { icon: 'grid',    label: 'Modules',   path: '/modules' },
  { icon: 'user',    label: 'You',       path: '/you' },
] as const

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { openSheet, setWebMode } = useApp()

  return (
    <div style={{
      width: 220, flexShrink: 0, height: '100vh',
      background: 'rgba(10,8,20,.96)',
      borderRight: `1px solid ${T.border}`,
      display: 'flex', flexDirection: 'column',
      padding: '28px 14px 20px',
      fontFamily: FONT_BODY,
    }}>
      {/* Logo */}
      <div style={{ padding: '0 10px', marginBottom: 28 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 800, color: T.text, letterSpacing: -.5 }}>
          PML <span style={{ background: T.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>↗</span>
        </div>
        <div style={{ fontSize: 11.5, color: T.dim, marginTop: 2, fontWeight: 600 }}>Propel My Life</div>
      </div>

      {/* Nav items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
        {NAV.map(item => {
          const active = pathname === item.path
          return (
            <Press key={item.path} onClick={() => router.push(item.path)} scale={0.97} style={{
              display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px',
              borderRadius: 12,
              background: active ? T.surface2 : 'transparent',
              border: `1px solid ${active ? T.border : 'transparent'}`,
              color: active ? T.text : T.dim,
            }}>
              <Icon name={item.icon} size={17} color={active ? T.a1 : T.dim} sw={active ? 2 : 1.7} />
              <span style={{ fontSize: 13.5, fontWeight: active ? 700 : 500 }}>{item.label}</span>
            </Press>
          )
        })}
      </div>

      {/* Quick Add */}
      <Press onClick={() => openSheet({ type: 'quick' })} scale={0.97} style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px',
        borderRadius: 14, background: T.grad, boxShadow: T.glow, marginBottom: 8,
      }}>
        <Icon name="plus" size={17} color="#fff" sw={2.2} />
        <span style={{ fontSize: 13.5, fontWeight: 700, color: '#fff' }}>Quick Add</span>
      </Press>

      {/* Switch to phone */}
      <Press onClick={() => setWebMode(false)} scale={0.97} style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
        borderRadius: 12, color: T.faint,
      }}>
        <Icon name="phone" size={15} color={T.faint} />
        <span style={{ fontSize: 12.5, fontWeight: 500 }}>Phone view</span>
      </Press>
    </div>
  )
}
