'use client'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { Press } from '@/components/ui/Press'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { StatusDropdown } from '@/components/tasks/StatusDropdown'
import { T } from '@/lib/theme'
import type { TaskStatus } from '@/lib/types'

const FONT_DISPLAY = "'Space Grotesk', 'Manrope', system-ui, sans-serif"

const PRIORITY_COLOR: Record<string, string> = { High: T.a3, Med: T.a1, Low: T.dim }

export default function Tasks() {
  const router = useRouter()
  const { tasks, setStatus, openSheet } = useApp()

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0 16px' }}>
        <Press onClick={() => router.push('/modules')} scale={0.9} style={{ width: 38, height: 38, borderRadius: 12, background: T.surface, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="chevR" size={18} color={T.text} style={{ transform: 'scaleX(-1)' }} />
        </Press>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.3, textTransform: 'uppercase', color: T.dim }}>Monday × Notion</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 700, letterSpacing: -.5, color: T.text, marginTop: 3 }}>Tasks</div>
        </div>
      </div>
      <div style={{ fontSize: 12.5, color: T.dim, margin: '-6px 2px 14px' }}>
        Tap a task to open · use the dropdown to change status
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {tasks.map(t => {
          const dn = t.subs.filter(s => s.done).length
          const p = t.status === 'Completed' ? 100 : (t.subs.length ? Math.round(dn / t.subs.length * 100) : 0)
          return (
            <Card key={t.id} pad={14} radius={18}>
              <Press onClick={() => openSheet({ type: 'task', id: t.id })} scale={0.99}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 15, fontWeight: 700, color: T.text, letterSpacing: -.2,
                      textDecoration: t.status === 'Completed' ? 'line-through' : 'none',
                      opacity: t.status === 'Completed' ? .6 : 1,
                    }}>
                      {t.title}
                    </div>
                    <div style={{ fontSize: 12, color: T.dim, marginTop: 3 }}>
                      Due {t.due} · <span style={{ color: PRIORITY_COLOR[t.priority], fontWeight: 700 }}>{t.priority}</span> · {dn}/{t.subs.length} subtasks
                    </div>
                  </div>
                </div>
              </Press>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
                <StatusDropdown
                  value={t.status}
                  small
                  onChange={(s: TaskStatus) => setStatus(t.id, s)}
                />
                <ProgressBar pct={p} done={p === 100} />
                <span style={{ fontSize: 11.5, fontWeight: 700, color: T.dim, width: 32 }}>{p}%</span>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
