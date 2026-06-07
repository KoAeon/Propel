'use client'
import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { Press } from '@/components/ui/Press'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { T } from '@/lib/theme'
import { formatDue } from '@/lib/seed'

const FONT_DISPLAY = "'Space Grotesk', 'Manrope', system-ui, sans-serif"
const FONT_BODY = "'Manrope', system-ui, sans-serif"
const STATUS_COLOR: Record<string, string> = { Active: T.good, 'On Hold': T.warn, Completed: T.dim }
const PRIORITY_COLOR: Record<string, string> = { High: T.a3, Med: T.a1, Low: T.dim }
function formatTime(t: string) {
  const [h, m] = t.split(':').map(Number)
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`
}

const PILLAR_GRAD: Record<string, [string, string]> = {
  'Family & Connection': ['#FF6BC1', '#FF9D8A'],
  'Financial Freedom':   ['#5B8DEF', '#9B6BFF'],
  'Health & Vitality':   ['#4FB477', '#7FD89B'],
  'Growth & Learning':   ['#9B6BFF', '#5B8DEF'],
}

function pillarGrad(pillar: string) {
  return PILLAR_GRAD[pillar] ?? ['#5B8DEF', '#9B6BFF']
}

export default function Projects() {
  const { projects, tasks, openSheet, deleteProject } = useApp()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [showCompleted, setShowCompleted] = useState(false)

  const completedCount = projects.filter(p => p.status === 'Completed').length
  const visibleProjects = projects.filter(p => showCompleted || p.status !== 'Completed')

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0 12px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.3, textTransform: 'uppercase', color: T.dim }}>Organise your goals</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 700, letterSpacing: -.5, color: T.text, marginTop: 3 }}>Projects</div>
        </div>
        <Press onClick={() => openSheet({ type: 'add-project' })} scale={0.9}
          style={{ width: 38, height: 38, borderRadius: 12, background: T.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: T.glow }}>
          <Icon name="plus" size={20} color="#fff" sw={2.2} />
        </Press>
      </div>

      {completedCount > 0 && (
        <Press onClick={() => setShowCompleted(v => !v)} scale={0.96} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12,
          padding: '6px 12px', borderRadius: 999,
          background: showCompleted ? T.surface2 : 'transparent',
          border: `1px solid ${showCompleted ? T.good + '66' : T.border}`,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: showCompleted ? T.good : T.dim }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: showCompleted ? T.good : T.dim }}>
            {showCompleted ? 'Hide completed' : `${completedCount} completed`}
          </span>
        </Press>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {visibleProjects.map(p => {
          const projTasks = tasks
            .filter(t => t.projectId === p.id)
            .sort((a, b) => {
              if (!a.due && !b.due) return 0
              if (!a.due) return 1
              if (!b.due) return -1
              return a.due < b.due ? -1 : 1
            })
          const done = projTasks.filter(t => t.status === 'Completed').length
          const pct = projTasks.length ? Math.round(done / projTasks.length * 100) : 0
          const [from, to] = pillarGrad(p.pillar)
          const open = expanded[p.id] ?? false

          return (
            <Card key={p.id} pad={16} radius={18}>
              {/* Project header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: `linear-gradient(135deg,${from},${to})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: T.glow }}>
                  <Icon name="folder" size={22} color="#fff" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>{p.title}</div>
                  {p.desc && <div style={{ fontSize: 12, color: T.dim, marginTop: 2 }}>{p.desc}</div>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                    <ProgressBar pct={pct} done={pct === 100} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: T.dim, flexShrink: 0 }}>{done}/{projTasks.length} tasks</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: STATUS_COLOR[p.status] }}>{p.status}</span>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <Press onClick={() => openSheet({ type: 'add-task', projectId: p.id })} scale={0.9}
                      style={{ width: 26, height: 26, borderRadius: 7, background: T.grad, boxShadow: T.glow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="plus" size={12} color="#fff" sw={2.2} />
                    </Press>
                    <Press onClick={() => openSheet({ type: 'edit-project', id: p.id })} scale={0.9}
                      style={{ width: 26, height: 26, borderRadius: 7, background: T.surface2, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="pencil" size={12} color={T.dim} />
                    </Press>
                    <Press onClick={() => deleteProject(p.id)} scale={0.9}
                      style={{ width: 26, height: 26, borderRadius: 7, background: T.surface2, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="trash" size={12} color={T.a3} />
                    </Press>
                  </div>
                </div>
              </div>

              {/* Toggle tasks */}
              {projTasks.length > 0 && (
                <Press onClick={() => setExpanded(e => ({ ...e, [p.id]: !open }))} scale={0.98} style={{
                  display: 'flex', alignItems: 'center', gap: 6, marginTop: 12,
                  padding: '6px 10px', borderRadius: 8,
                  background: T.surface2, border: `1px solid ${T.border}`,
                  width: 'fit-content',
                }}>
                  <Icon name="chevR" size={12} color={T.dim} style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform .2s ease' }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: T.dim, fontFamily: FONT_BODY }}>
                    {open ? 'Hide tasks' : 'Show tasks'}
                  </span>
                </Press>
              )}

              {/* Task list */}
              {open && projTasks.length > 0 && (
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {projTasks.map(t => (
                    <Press key={t.id} onClick={() => openSheet({ type: 'edit-task', id: t.id })} scale={0.99}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px',
                        background: T.surface2, borderRadius: 12, border: `1px solid ${T.border}`,
                      }}>
                        <div style={{
                          width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                          background: t.status === 'Completed' ? T.good : PRIORITY_COLOR[t.priority],
                        }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: T.text, textDecoration: t.status === 'Completed' ? 'line-through' : 'none', opacity: t.status === 'Completed' ? .6 : 1 }}>
                            {t.title}
                          </div>
                          {t.due && <div style={{ fontSize: 11, color: T.dim, marginTop: 1 }}>Due {formatDue(t.due)}{t.time ? ` · ${formatTime(t.time)}` : ''}</div>}
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: T.dim, flexShrink: 0 }}>{t.status}</span>
                      </div>
                    </Press>
                  ))}
                  <Press onClick={() => openSheet({ type: 'add-task', projectId: p.id })} scale={0.98} style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '7px 11px',
                    borderRadius: 10, border: `1px dashed ${T.border}`,
                  }}>
                    <Icon name="plus" size={12} color={T.dim} sw={2} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: T.dim, fontFamily: FONT_BODY }}>Add task</span>
                  </Press>
                </div>
              )}
            </Card>
          )
        })}
        {visibleProjects.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: T.faint, fontSize: 14, fontFamily: FONT_BODY }}>
            {projects.length === 0 ? 'No projects yet — tap + to create one' : 'All projects completed'}
          </div>
        )}
      </div>
    </div>
  )
}
