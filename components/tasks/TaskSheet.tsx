'use client'
import { useState } from 'react'
import { Sheet } from '@/components/sheets/Sheet'
import { Press } from '@/components/ui/Press'
import { T } from '@/lib/theme'
import { useApp } from '@/context/AppContext'
import { StatusDropdown } from './StatusDropdown'
import type { Task, TaskStatus, TaskPriority } from '@/lib/types'

const FONT_BODY = "'Manrope', system-ui, sans-serif"
const PRIORITIES: TaskPriority[] = ['High', 'Med', 'Low']
const PRIORITY_COLOR: Record<string, string> = { High: T.a3, Med: T.a1, Low: T.dim }

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

interface Props { editId?: string; projectId?: string }

export function TaskSheet({ editId, projectId }: Props) {
  const { closeSheet, tasks, projects, addTask, editTask, addReminder } = useApp()
  const existing = editId ? tasks.find(t => t.id === editId) : undefined

  const [title, setTitle] = useState(existing?.title ?? '')
  const [desc, setDesc] = useState(existing?.desc ?? '')
  const [due, setDue] = useState(existing?.due ?? '')
  const [status, setStatus] = useState<TaskStatus>(existing?.status ?? 'Not Started')
  const [priority, setPriority] = useState<TaskPriority>(existing?.priority ?? 'Med')
  const [pillar, setPillar] = useState(existing?.pillar ?? '')
  const [projId, setProjId] = useState(existing?.projectId ?? projectId ?? '')
  const [addToReminders, setAddToReminders] = useState(false)
  const [reminderTime, setReminderTime] = useState('')

  const ok = title.trim().length > 0

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 12,
    background: T.surface2, border: `1px solid ${T.border}`,
    color: T.text, fontFamily: FONT_BODY, fontSize: 14, outline: 'none',
    colorScheme: 'dark',
  }

  function daysUntil(iso: string) {
    const target = new Date(iso + 'T12:00:00')
    const today = new Date(); today.setHours(0, 0, 0, 0)
    return Math.max(0, Math.round((target.getTime() - today.getTime()) / 86400000))
  }

  const handleSave = () => {
    if (!ok) return
    const task: Omit<Task, 'id'> = {
      title: title.trim(), desc: desc.trim(), due, status, priority,
      pillar: pillar.trim(), projectId: projId || undefined, subs: existing?.subs ?? [],
    }
    if (editId) {
      editTask(editId, task)
    } else {
      addTask(task)
      if (addToReminders && due) {
        const formatted = new Date(due + 'T12:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
        const time = reminderTime || '09:00'
        addReminder({
          glyph: '✅', title: title.trim(),
          sub: `Due ${formatted} · ${time} · ${priority} priority`,
          days: daysUntil(due), date: due, time, cat: 'Task',
        })
      }
    }
  }

  return (
    <Sheet onClose={closeSheet} title={editId ? 'Edit Task' : 'New Task'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily: FONT_BODY }}>

        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Task title"
          autoFocus style={inputStyle} />

        <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description (optional)"
          rows={3} style={{ ...inputStyle, resize: 'none', lineHeight: 1.5 }} />

        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.dim, marginBottom: 6 }}>Due date</div>
            <input type="date" value={due} min={todayISO()} onChange={e => setDue(e.target.value)}
              style={{ ...inputStyle, width: '100%' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.dim, marginBottom: 6 }}>Status</div>
            <StatusDropdown value={status} onChange={setStatus} />
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.dim, marginBottom: 8 }}>Priority</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {PRIORITIES.map(p => (
              <Press key={p} onClick={() => setPriority(p)} scale={0.95} style={{
                flex: 1, padding: '9px 0', borderRadius: 10, textAlign: 'center',
                fontSize: 13, fontWeight: 700,
                background: priority === p ? T.surface2 : 'transparent',
                color: priority === p ? PRIORITY_COLOR[p] : T.dim,
                border: `1px solid ${priority === p ? PRIORITY_COLOR[p] + '88' : T.border}`,
              }}>{p}</Press>
            ))}
          </div>
        </div>

        <input value={pillar} onChange={e => setPillar(e.target.value)} placeholder="Life pillar (e.g. Family & Connection)"
          style={inputStyle} />

        {projects.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.dim, marginBottom: 8 }}>Project (optional)</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              <Press onClick={() => setProjId('')} scale={0.95} style={{
                padding: '7px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                background: !projId ? T.surface2 : 'transparent',
                color: !projId ? T.text : T.dim,
                border: `1px solid ${!projId ? T.border : 'transparent'}`,
              }}>None</Press>
              {projects.map(p => (
                <Press key={p.id} onClick={() => setProjId(p.id)} scale={0.95} style={{
                  padding: '7px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                  background: projId === p.id ? T.grad : 'transparent',
                  color: projId === p.id ? '#fff' : T.dim,
                  border: `1px solid ${projId === p.id ? 'transparent' : T.border}`,
                  boxShadow: projId === p.id ? T.glow : 'none',
                }}>{p.title}</Press>
              ))}
            </div>
          </div>
        )}

        {!editId && due && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Press onClick={() => setAddToReminders(v => !v)} scale={0.98} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12,
              background: addToReminders ? T.surface2 : 'transparent',
              border: `1px solid ${addToReminders ? T.a1 + '66' : T.border}`,
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                background: addToReminders ? T.a1 : 'transparent',
                border: `2px solid ${addToReminders ? T.a1 : T.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all .15s ease',
              }}>
                {addToReminders && <span style={{ fontSize: 12, color: '#fff', lineHeight: 1 }}>✓</span>}
              </div>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: addToReminders ? T.text : T.dim }}>
                Also add to Reminders
              </span>
            </Press>
            {addToReminders && (
              <div style={{ paddingLeft: 2 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.dim, marginBottom: 6 }}>Reminder time <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(defaults to 9:00 am)</span></div>
                <input type="time" value={reminderTime} onChange={e => setReminderTime(e.target.value)}
                  style={{ ...inputStyle, width: 'auto' }} />
              </div>
            )}
          </div>
        )}

        <Press onClick={handleSave} scale={0.97} style={{
          marginTop: 4, padding: 15, borderRadius: 16, textAlign: 'center',
          fontWeight: 700, fontSize: 15,
          background: ok ? T.grad : T.surface2,
          color: ok ? '#fff' : T.faint,
          boxShadow: ok ? T.glow : 'none',
        }}>
          {editId ? 'Save changes' : 'Add task'}
        </Press>
      </div>
    </Sheet>
  )
}
