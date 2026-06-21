'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { Press } from '@/components/ui/Press'
import { T } from '@/lib/theme'
import type { RenoTaskStatus } from '@/lib/types'

const FONT_DISPLAY = "'Space Grotesk', 'Manrope', system-ui, sans-serif"
const FONT_BODY = "'Manrope', system-ui, sans-serif"

const STATUS_COLOR: Record<RenoTaskStatus, string> = {
  'Not Started': T.dim,
  'In Progress': T.a1,
  'Complete': T.good,
}

function formatDate(d: string) {
  if (!d) return ''
  const [y, m, day] = d.split('-').map(Number)
  return new Date(y, m - 1, day).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function RenoTasks() {
  const router = useRouter()
  const { renoTasks, openSheet, deleteRenoTask } = useApp()
  const [showComplete, setShowComplete] = useState(false)

  const completeCount = renoTasks.filter(t => t.status === 'Complete').length
  const visible = [...renoTasks]
    .filter(t => showComplete || t.status !== 'Complete')
    .sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return a.dueDate < b.dueDate ? -1 : 1
    })

  return (
    <div style={{ fontFamily: FONT_BODY }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0 12px' }}>
        <Press onClick={() => router.push('/modules')} scale={0.9} style={{
          width: 38, height: 38, borderRadius: 12,
          background: T.surface, border: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="chevR" size={18} color={T.text} style={{ transform: 'scaleX(-1)' }} />
        </Press>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.3, textTransform: 'uppercase', color: T.dim }}>
            RenoTrack
          </div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 700, letterSpacing: -.5, color: T.text, marginTop: 3 }}>
            Tasks
          </div>
        </div>
        <Press onClick={() => openSheet({ type: 'add-reno-task' })} scale={0.9} style={{
          width: 38, height: 38, borderRadius: 12,
          background: T.grad, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: T.glow,
        }}>
          <Icon name="plus" size={20} color="#fff" sw={2.2} />
        </Press>
      </div>

      {completeCount > 0 && (
        <Press onClick={() => setShowComplete(v => !v)} scale={0.96} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12,
          padding: '6px 12px', borderRadius: 999,
          background: showComplete ? T.surface2 : 'transparent',
          border: `1px solid ${showComplete ? T.good + '66' : T.border}`,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: showComplete ? T.good : T.dim }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: showComplete ? T.good : T.dim }}>
            {showComplete ? 'Hide completed' : `${completeCount} completed`}
          </span>
        </Press>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {visible.map(t => (
          <Card key={t.id} pad={14} radius={18}>
            <Press onClick={() => openSheet({ type: 'edit-reno-task', id: t.id })} scale={0.99}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 15, fontWeight: 700, color: T.text, letterSpacing: -.2,
                    textDecoration: t.status === 'Complete' ? 'line-through' : 'none',
                    opacity: t.status === 'Complete' ? .6 : 1,
                  }}>
                    {t.title}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 10px', marginTop: 5 }}>
                    {t.assignedTo && (
                      <span style={{ fontSize: 12, fontWeight: 700, color: T.a2 }}>{t.assignedTo}</span>
                    )}
                    {t.dueDate && (
                      <span style={{ fontSize: 12, color: T.dim }}>Due {formatDate(t.dueDate)}</span>
                    )}
                    {t.dateCompleted && (
                      <span style={{ fontSize: 12, color: T.good }}>Done {formatDate(t.dateCompleted)}</span>
                    )}
                  </div>
                  {t.notes ? (
                    <div style={{ fontSize: 12.5, color: T.dim, marginTop: 5, lineHeight: 1.4 }}>
                      {t.notes}
                    </div>
                  ) : null}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                  <Press
                    onClick={e => { e.stopPropagation(); deleteRenoTask(t.id) }}
                    scale={0.9}
                    style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: T.surface2, border: `1px solid ${T.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Icon name="trash" size={13} color={T.a3} />
                  </Press>
                </div>
              </div>
            </Press>
            <div style={{ marginTop: 10 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '5px 10px', borderRadius: 8,
                background: STATUS_COLOR[t.status] + '18',
                border: `1px solid ${STATUS_COLOR[t.status]}44`,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_COLOR[t.status] }} />
                <span style={{ fontSize: 11.5, fontWeight: 700, color: STATUS_COLOR[t.status] }}>{t.status}</span>
              </div>
            </div>
          </Card>
        ))}
        {renoTasks.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: T.faint, fontSize: 14 }}>
            No tasks yet — tap + to add one
          </div>
        )}
      </div>
    </div>
  )
}
