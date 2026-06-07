'use client'
import { useState } from 'react'
import { Sheet } from '@/components/sheets/Sheet'
import { Press } from '@/components/ui/Press'
import { T } from '@/lib/theme'
import { useApp } from '@/context/AppContext'
import type { Project, ProjectStatus } from '@/lib/types'

const FONT_BODY = "'Manrope', system-ui, sans-serif"
const STATUSES: ProjectStatus[] = ['Active', 'On Hold', 'Completed']
const STATUS_COLOR: Record<ProjectStatus, string> = { Active: T.good, 'On Hold': T.warn, Completed: T.dim }

interface Props { editId?: string }

export function ProjectSheet({ editId }: Props) {
  const { closeSheet, projects, addProject, editProject } = useApp()
  const existing = editId ? projects.find(p => p.id === editId) : undefined

  const [title, setTitle] = useState(existing?.title ?? '')
  const [desc, setDesc] = useState(existing?.desc ?? '')
  const [status, setStatus] = useState<ProjectStatus>(existing?.status ?? 'Active')
  const [pillar, setPillar] = useState(existing?.pillar ?? '')

  const ok = title.trim().length > 0

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 12,
    background: T.surface2, border: `1px solid ${T.border}`,
    color: T.text, fontFamily: FONT_BODY, fontSize: 14, outline: 'none',
  }

  const handleSave = () => {
    if (!ok) return
    const project: Omit<Project, 'id'> = {
      title: title.trim(), desc: desc.trim(),
      status, pillar: pillar.trim(),
    }
    if (editId) editProject(editId, project)
    else addProject(project)
  }

  return (
    <Sheet onClose={closeSheet} title={editId ? 'Edit Project' : 'New Project'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily: FONT_BODY }}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Project name"
          autoFocus style={inputStyle} />

        <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description (optional)"
          rows={2} style={{ ...inputStyle, resize: 'none', lineHeight: 1.5 }} />

        <input value={pillar} onChange={e => setPillar(e.target.value)}
          placeholder="Life pillar (e.g. Financial Freedom)" style={inputStyle} />

        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.dim, marginBottom: 8 }}>Status</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {STATUSES.map(s => (
              <Press key={s} onClick={() => setStatus(s)} scale={0.95} style={{
                flex: 1, padding: '9px 0', borderRadius: 10, textAlign: 'center',
                fontSize: 12, fontWeight: 700,
                background: status === s ? T.surface2 : 'transparent',
                color: status === s ? STATUS_COLOR[s] : T.dim,
                border: `1px solid ${status === s ? STATUS_COLOR[s] + '66' : T.border}`,
              }}>{s}</Press>
            ))}
          </div>
        </div>

        <Press onClick={handleSave} scale={0.97} style={{
          marginTop: 4, padding: 15, borderRadius: 16, textAlign: 'center',
          fontWeight: 700, fontSize: 15,
          background: ok ? T.grad : T.surface2,
          color: ok ? '#fff' : T.faint,
          boxShadow: ok ? T.glow : 'none',
        }}>
          {editId ? 'Save changes' : 'Create project'}
        </Press>
      </div>
    </Sheet>
  )
}
