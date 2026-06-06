'use client'
import { usePathname, useRouter } from 'next/navigation'
import { T } from '@/lib/theme'
import { Icon } from '@/components/ui/Icon'
import { Press } from '@/components/ui/Press'
import { useApp } from '@/context/AppContext'

const NAV = [
  { icon: 'home', label: 'Home', path: '/home' },
  { icon: 'grid', label: 'Modules', path: '/modules' },
  { icon: 'plus', label: '', path: 'add' },
  { icon: 'bell', label: 'Reminders', path: '/reminders' },
  { icon: 'user', label: 'You', path: '/you' },
] as const

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { openSheet } = useApp()

  return (
    <div style={{
      position: 'absolute', left: 14, right: 14, bottom: 14, height: 64,
      background: 'rgba(16,13,29,.78)',
      border: `1px solid ${T.border}`,
      borderRadius: 24,
      backdropFilter: 'blur(22px)',
      WebkitBackdropFilter: 'blur(22px)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '0 8px', zIndex: 10,
      boxShadow: '0 10px 30px rgba(0,0,0,.4)',
    }}>
      {NAV.map(item => item.icon === 'plus' ? (
        <Press
          key="add"
          onClick={() => openSheet({ type: 'quick' })}
          scale={0.88}
          style={{
            width: 50, height: 50, borderRadius: 17, background: T.grad,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: T.glow, marginTop: -2,
          }}
        >
          <Icon name="plus" size={24} color="#fff" sw={2.2} />
        </Press>
      ) : (
        <Press
          key={item.path}
          onClick={() => router.push(item.path)}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            color: pathname === item.path ? T.a1 : T.faint,
            minWidth: 52,
          }}
        >
          <Icon name={item.icon} size={21} sw={pathname === item.path ? 2 : 1.7} />
          <span style={{ fontSize: 9.5, fontWeight: 600 }}>{item.label}</span>
        </Press>
      ))}
    </div>
  )
}
