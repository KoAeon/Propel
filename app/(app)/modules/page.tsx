'use client'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { Press } from '@/components/ui/Press'
import { T } from '@/lib/theme'

const FONT_DISPLAY = "'Space Grotesk', 'Manrope', system-ui, sans-serif"

const MODULES = [
  { icon: 'flame',   label: 'Habits',       dest: '/habits',    live: true  },
  { icon: 'bell',    label: 'Reminders',    dest: '/reminders', live: true  },
  { icon: 'doc',     label: 'Tasks',        dest: '/tasks',     live: true  },
  { icon: 'folder',  label: 'Projects',     dest: '/projects',  live: true  },
  { icon: 'user',    label: 'People',       dest: '/people',    live: true  },
  { icon: 'target',  label: 'Goals & Vision', dest: null,       live: false },
  { icon: 'heart',   label: 'Health',       dest: null,         live: false },
  { icon: 'wallet',  label: 'Wealth',       dest: null,         live: false },
  { icon: 'leaf',    label: 'Peacefulness', dest: null,         live: false },
  { icon: 'book',    label: 'Study',        dest: null,         live: false },
  { icon: 'gift',    label: 'Good News',    dest: '/good-news', live: true  },
  { icon: 'bulb',    label: 'Ideas',        dest: null,         live: false },
] as const

export default function Modules() {
  const router = useRouter()
  const { flash } = useApp()

  return (
    <div>
      <div style={{ padding: '4px 0 16px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.3, textTransform: 'uppercase', color: T.dim }}>
          Your whole life, organised
        </div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 700, letterSpacing: -.5, color: T.text, marginTop: 3 }}>
          Modules
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {MODULES.map(m => (
          <Press
            key={m.label}
            onClick={() => m.live && m.dest ? router.push(m.dest) : flash(m.label + ' is in the design map — coming soon')}
            scale={0.97}
          >
            <Card pad={15} radius={18} style={{ position: 'relative', height: 104, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: m.live ? T.grad : T.surface2,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: m.live ? T.glow : 'none',
                border: m.live ? 'none' : `1px solid ${T.border}`,
              }}>
                <Icon name={m.icon} size={20} color={m.live ? '#fff' : T.dim} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{m.label}</div>
                <div style={{ fontSize: 11, color: m.live ? T.good : T.faint, fontWeight: 600, marginTop: 1 }}>
                  {m.live ? 'Live' : 'In design'}
                </div>
              </div>
            </Card>
          </Press>
        ))}
      </div>
    </div>
  )
}
