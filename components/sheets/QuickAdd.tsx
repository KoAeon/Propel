'use client'
import { useRouter } from 'next/navigation'
import { Sheet } from './Sheet'
import { Tile } from '@/components/ui/Tile'
import { Icon } from '@/components/ui/Icon'
import { Press } from '@/components/ui/Press'
import { T } from '@/lib/theme'
import { useApp } from '@/context/AppContext'

const FONT_BODY = "'Manrope', system-ui, sans-serif"

const ITEMS = [
  { glyph: '🔔', label: 'Reminder', action: 'reminder' },
  { glyph: '✅', label: 'Task', action: 'task' },
  { glyph: '🔥', label: 'Habit', action: 'habit' },
] as const

export function QuickAdd() {
  const { closeSheet, openSheet, flash } = useApp()
  const router = useRouter()

  const handle = (action: string) => {
    if (action === 'reminder') {
      openSheet({ type: 'reminder' })
    } else if (action === 'task') {
      closeSheet()
      router.push('/tasks')
      flash('Add tasks from the Tasks screen')
    } else {
      closeSheet()
      router.push('/habits')
      flash('Track habits from the Habits screen')
    }
  }

  return (
    <Sheet title="Quick add" onClose={closeSheet}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ITEMS.map(it => (
          <Press
            key={it.action}
            onClick={() => handle(it.action)}
            scale={0.98}
            style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: 15,
              borderRadius: 16, background: T.surface2, border: `1px solid ${T.border}`,
              fontFamily: FONT_BODY,
            }}
          >
            <Tile glyph={it.glyph} from={T.a1} to={T.a2} size={42} radius={13} />
            <span style={{ fontSize: 15.5, fontWeight: 700, color: T.text }}>New {it.label}</span>
            <Icon name="chevR" size={18} color={T.dim} style={{ marginLeft: 'auto' }} />
          </Press>
        ))}
      </div>
    </Sheet>
  )
}
