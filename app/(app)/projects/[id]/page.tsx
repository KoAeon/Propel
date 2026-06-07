'use client'
import { useParams, useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { Press } from '@/components/ui/Press'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { StatusDropdown } from '@/components/tasks/StatusDropdown'
import { T } from '@/lib/theme'
import { formatDue } from '@/lib/seed'
import type { TaskStatus } from '@/lib/types'

const FONT_DISPLAY = "'Space Grotesk', 'Manrope', system-ui, sans-serif"
const PRIORITY_COLOR: Record<string, string> = { High: T.a3, Med: T.a1, Low: T.dim }
const STATUS_COLOR: Record<string, string> = { Active: T.good, 'On Hold': T.warn, Completed: T.dim }

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { projects, tasks, openSheet, setStatus } = useApp()

  const project = projects.find(p => p.id === id)
  if (!project) return null

  const projTasks = tasks.filter(t => t.projectId === id)
  const done = projTasks.filter(t => t.status === 'Completed').length
  const pct = projTasks.length ? Math.round(done / projTasks.length * 100) : 0

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0 16px' }}>
        <Press onClick={() => router.push('/projects')} scale={0.9}
          style={{ width: 38, height: 38, borderRadius: 12, background: T.surface, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="chevR" size={18} color={T.text} style={{ transform: 'scaleX(-1)' }} />
        </Press>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.3, textTransform: 'uppercase', color: T.dim }}>{project.pillar || 'Project'}</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 700, letterSpacing: -.5, color: T.text, marginTop: 3 }}>{project.title}</div>
        </div>
        <Press onClick={() => openSheet({ type: 'edit-project', id: project.id })} scale={0.9}
          style={{ width: 38, height: 38, borderRadius: 12, background: T.surface, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="pencil" size={16} color={T.dim} />
        </Press>
      </div>

      {project.desc && (
        <div style={{ fontSize: 13.5, color: T.dim, lineHeight: 1.55, margin: '-4px 2px 14px' }}>{project.desc}</div>
      )}

      <Card pad={14} radius={16} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <ProgressBar pct={pct} done={pct === 100} />
        <span style={{ fontSize: 12, fontWeight: 700, color: T.dim, flexShrink: 0 }}>{done}/{projTasks.length} done</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: STATUS_COLOR[project.status], marginLeft: 'auto' }}>{project.status}</span>
      </Card>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 700, color: T.text, letterSpacing: -.3 }}>Tasks</div>
        <Press onClick={() => openSheet({ type: 'add-task', projectId: id })} scale={0.9}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 10, background: T.grad, boxShadow: T.glow }}>
          <Icon name="plus" size={14} color="#fff" sw={2.2} />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Add task</span>
        </Press>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {projTasks.map(t => {
          const dn = t.subs.filter(s => s.done).length
          const p = t.status === 'Completed' ? 100 : (t.subs.length ? Math.round(dn / t.subs.length * 100) : 0)
          return (
            <Card key={t.id} pad={14} radius={16}>
              <Press onClick={() => openSheet({ type: 'task', id: t.id })} scale={0.99}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 700, color: T.text, textDecoration: t.status === 'Completed' ? 'line-through' : 'none', opacity: t.status === 'Completed' ? .6 : 1 }}>
                      {t.title}
                    </div>
                    <div style={{ fontSize: 12, color: T.dim, marginTop: 3 }}>
                      {t.due && <span>Due {formatDue(t.due)} · </span>}
                      <span style={{ color: PRIORITY_COLOR[t.priority], fontWeight: 700 }}>{t.priority}</span>
                    </div>
                  </div>
                </div>
              </Press>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
                <StatusDropdown value={t.status} small onChange={(s: TaskStatus) => setStatus(t.id, s)} />
                <ProgressBar pct={p} done={p === 100} />
                <span style={{ fontSize: 11, fontWeight: 700, color: T.dim }}>{p}%</span>
              </div>
            </Card>
          )
        })}
        {projTasks.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: T.faint, fontSize: 13 }}>
            No tasks yet — tap "Add task" to get started
          </div>
        )}
      </div>
    </div>
  )
}
