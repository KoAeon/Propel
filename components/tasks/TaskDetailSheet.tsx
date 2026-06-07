'use client'
import { Sheet } from '@/components/sheets/Sheet'
import { StatusDropdown } from './StatusDropdown'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Press } from '@/components/ui/Press'
import { Checkbox } from '@/components/ui/Checkbox'
import { Icon } from '@/components/ui/Icon'
import { T } from '@/lib/theme'
import { useApp } from '@/context/AppContext'
import { formatDue } from '@/lib/seed'
import type { Task, TaskStatus } from '@/lib/types'

const FONT_BODY = "'Manrope', system-ui, sans-serif"
const FONT_DISPLAY = "'Space Grotesk', 'Manrope', system-ui, sans-serif"
const PRIORITY_COLOR: Record<string, string> = { High: T.a3, Med: T.a1, Low: T.dim }

export function TaskDetailSheet({ task }: { task: Task }) {
  const { closeSheet, openSheet, toggleSub, setStatus, setSubText, setSubDue, addSub, delSub, deleteTask, projects } = useApp()

  const doneN = task.subs.filter(s => s.done).length
  const pct = task.status === 'Completed' ? 100 : (task.subs.length ? Math.round((doneN / task.subs.length) * 100) : 0)
  const project = task.projectId ? projects.find(p => p.id === task.projectId) : null

  const inputBase: React.CSSProperties = {
    background: 'transparent', border: 'none', outline: 'none',
    fontFamily: FONT_BODY, padding: 0, minWidth: 0,
  }

  return (
    <Sheet onClose={closeSheet} title="Task" right={
      <div style={{ display: 'flex', gap: 8 }}>
        <Press onClick={() => openSheet({ type: 'edit-task', id: task.id })} scale={0.9}
          style={{ width: 32, height: 32, borderRadius: 9, background: T.surface2, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="pencil" size={14} color={T.dim} />
        </Press>
        <Press onClick={() => deleteTask(task.id)} scale={0.9}
          style={{ width: 32, height: 32, borderRadius: 9, background: T.surface2, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="trash" size={14} color={T.a3} />
        </Press>
      </div>
    }>
      <StatusDropdown value={task.status} onChange={(s: TaskStatus) => setStatus(task.id, s)} />

      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 21, fontWeight: 700, letterSpacing: -.4, color: T.text, marginTop: 14, lineHeight: 1.2 }}>
        {task.title}
      </div>
      {task.desc && (
        <div style={{ fontSize: 13.5, color: T.dim, lineHeight: 1.55, marginTop: 10 }}>{task.desc}</div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14 }}>
        <ProgressBar pct={pct} done={pct === 100} />
        <span style={{ fontSize: 12, fontWeight: 700, color: T.dim, width: 34 }}>{pct}%</span>
      </div>

      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 11 }}>
        {task.due && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: T.dim, fontWeight: 600 }}>Due</span>
            <span style={{ color: T.text, fontWeight: 700 }}>{formatDue(task.due)}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span style={{ color: T.dim, fontWeight: 600 }}>Priority</span>
          <span style={{ color: PRIORITY_COLOR[task.priority], fontWeight: 700 }}>{task.priority}</span>
        </div>
        {task.pillar && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: T.dim, fontWeight: 600 }}>Pillar</span>
            <span style={{ color: T.text, fontWeight: 700 }}>{task.pillar}</span>
          </div>
        )}
        {project && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: T.dim, fontWeight: 600 }}>Project</span>
            <span style={{ color: T.a2, fontWeight: 700 }}>{project.title}</span>
          </div>
        )}
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: .8, textTransform: 'uppercase', color: T.faint, margin: '20px 0 11px' }}>
        Subtasks · {doneN}/{task.subs.length}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {task.subs.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px', borderRadius: 11, background: T.surface }}>
            <Press onClick={() => toggleSub(task.id, i)} scale={0.9}>
              <Checkbox on={s.done} size={21} />
            </Press>
            <input
              value={s.t}
              onChange={e => setSubText(task.id, i, e.target.value)}
              placeholder="Subtask…"
              style={{
                ...inputBase, flex: 1,
                color: s.done ? T.dim : T.text,
                fontSize: 14, fontWeight: 500,
                textDecoration: s.done ? 'line-through' : 'none',
              }}
            />
            <input
              type="date"
              value={s.due || ''}
              onChange={e => setSubDue(task.id, i, e.target.value)}
              style={{
                ...inputBase,
                width: s.due ? 100 : 56,
                fontSize: 11, fontWeight: 700,
                color: s.due ? T.a1 : T.faint,
                background: s.due ? T.surface2 : 'transparent',
                border: `1px solid ${s.due ? T.border : 'transparent'}`,
                borderRadius: 8, padding: '4px 6px',
                colorScheme: 'dark',
                cursor: 'pointer',
              }}
            />
            <Press onClick={() => delSub(task.id, i)} scale={0.85}
              style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.faint, fontSize: 14 }}>
              ✕
            </Press>
          </div>
        ))}
        <Press onClick={() => addSub(task.id)} scale={0.99}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 8px' }}>
          <div style={{ width: 21, height: 21, borderRadius: '50%', border: `1.5px dashed ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="plus" size={12} color={T.a1} sw={2.4} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: T.a1 }}>Add subtask</span>
        </Press>
      </div>
    </Sheet>
  )
}
