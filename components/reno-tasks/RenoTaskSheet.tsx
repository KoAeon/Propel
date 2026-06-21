'use client'
import { useState } from 'react'
import { Sheet } from '@/components/sheets/Sheet'
import { Press } from '@/components/ui/Press'
import { T } from '@/lib/theme'
import { useApp } from '@/context/AppContext'
import type { RenoTask, RenoTaskStatus, RenoTaskAssignee } from '@/lib/types'

const FONT_BODY = "'Manrope', system-ui, sans-serif"
const ASSIGNEES: RenoTaskAssignee[] = ['Zara', 'Richard', 'Sam']
const STATUSES: RenoTaskStatus[] = ['Not Started', 'In Progress', 'Complete']

const STATUS_COLOR: Record<RenoTaskStatus, string> = {
  'Not Started': T.dim,
  'In Progress': T.a1,
  'Complete': T.good,
}

interface Props { editId?: string }

export function RenoTaskSheet({ editId }: Props) {
  const { closeSheet, renoTasks, addRenoTask, editRenoTask } = useApp()
  const existing = editId ? renoTasks.find(t => t.id === editId) : undefined

  const [title, setTitle] = useState(existing?.title ?? '')
  const [notes, setNotes] = useState(existing?.notes ?? '')
  const [assignedTo, setAssignedTo] = useState<RenoTaskAssignee | ''>(existing?.assignedTo ?? '')
  const [dueDate, setDueDate] = useState(existing?.dueDate ?? '')
  const [dateCompleted, setDateCompleted] = useState(existing?.dateCompleted ?? '')
  const [status, setStatus] = useState<RenoTaskStatus>(existing?.status ?? 'Not Started')

  const ok = title.trim().length > 0

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 12,
    background: T.surface2, border: `1px solid ${T.border}`,
    color: T.text, fontFamily: FONT_BODY, fontSize: 14, outline: 'none',
    colorScheme: 'dark',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
    color: T.dim, marginBottom: 6,
  }

  const handleSave = () => {
    if (!ok) return
    const task: Omit<RenoTask, 'id'> = {
      title: title.trim(),
      notes: notes.trim(),
      assignedTo,
      dueDate,
      dateCompleted,
      status,
    }
    if (editId) editRenoTask(editId, task)
    else addRenoTask(task)
  }

  return (
    <Sheet onClose={closeSheet} title={editId ? 'Edit Task' : 'New Task'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontFamily: FONT_BODY }}>

        <div>
          <div style={labelStyle}>Description</div>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Short description"
            autoFocus
            style={inputStyle}
          />
        </div>

        <div>
          <div style={labelStyle}>Notes</div>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Additional notes (optional)"
            rows={3}
            style={{ ...inputStyle, resize: 'none', lineHeight: 1.5 }}
          />
        </div>

        <div>
          <div style={labelStyle}>Assigned to</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {ASSIGNEES.map(a => (
              <Press key={a} onClick={() => setAssignedTo(assignedTo === a ? '' : a)} scale={0.95} style={{
                flex: 1, padding: '9px 0', borderRadius: 10, textAlign: 'center',
                fontSize: 13, fontWeight: 700,
                background: assignedTo === a ? T.surface2 : 'transparent',
                color: assignedTo === a ? T.text : T.dim,
                border: `1px solid ${assignedTo === a ? T.a2 + '99' : T.border}`,
                boxShadow: assignedTo === a ? `0 0 0 1px ${T.a2}44` : 'none',
              }}>{a}</Press>
            ))}
          </div>
        </div>

        <div>
          <div style={labelStyle}>Status</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {STATUSES.map(s => (
              <Press key={s} onClick={() => setStatus(s)} scale={0.95} style={{
                flex: 1, padding: '9px 4px', borderRadius: 10, textAlign: 'center',
                fontSize: 12, fontWeight: 700,
                background: status === s ? T.surface2 : 'transparent',
                color: status === s ? STATUS_COLOR[s] : T.dim,
                border: `1px solid ${status === s ? STATUS_COLOR[s] + '88' : T.border}`,
              }}>{s}</Press>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Due date</div>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              style={{ ...inputStyle, width: '100%' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Date completed</div>
            <input
              type="date"
              value={dateCompleted}
              onChange={e => setDateCompleted(e.target.value)}
              style={{ ...inputStyle, width: '100%' }}
            />
          </div>
        </div>

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
