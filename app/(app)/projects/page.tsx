'use client'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { Press } from '@/components/ui/Press'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { T } from '@/lib/theme'

const FONT_DISPLAY = "'Space Grotesk', 'Manrope', system-ui, sans-serif"
const FONT_BODY = "'Manrope', system-ui, sans-serif"
const STATUS_COLOR: Record<string, string> = { Active: T.good, 'On Hold': T.warn, Completed: T.dim }
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
  const router = useRouter()
  const { projects, tasks, openSheet, editProject, deleteProject } = useApp()

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0 16px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.3, textTransform: 'uppercase', color: T.dim }}>Organise your goals</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 700, letterSpacing: -.5, color: T.text, marginTop: 3 }}>Projects</div>
        </div>
        <Press onClick={() => openSheet({ type: 'add-project' })} scale={0.9}
          style={{ width: 38, height: 38, borderRadius: 12, background: T.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: T.glow }}>
          <Icon name="plus" size={20} color="#fff" sw={2.2} />
        </Press>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {projects.map(p => {
          const projTasks = tasks.filter(t => t.projectId === p.id)
          const done = projTasks.filter(t => t.status === 'Completed').length
          const pct = projTasks.length ? Math.round(done / projTasks.length * 100) : 0
          const [from, to] = pillarGrad(p.pillar)
          return (
            <Card key={p.id} pad={16} radius={18}>
              <Press onClick={() => router.push(`/projects/${p.id}`)} scale={0.99}>
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
                      <Press onClick={e => { e.stopPropagation(); openSheet({ type: 'edit-project', id: p.id }) }} scale={0.9}
                        style={{ width: 26, height: 26, borderRadius: 7, background: T.surface2, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="pencil" size={12} color={T.dim} />
                      </Press>
                      <Press onClick={e => { e.stopPropagation(); deleteProject(p.id) }} scale={0.9}
                        style={{ width: 26, height: 26, borderRadius: 7, background: T.surface2, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="trash" size={12} color={T.a3} />
                      </Press>
                    </div>
                  </div>
                </div>
              </Press>
            </Card>
          )
        })}
        {projects.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: T.faint, fontSize: 14, fontFamily: FONT_BODY }}>
            No projects yet — tap + to create one
          </div>
        )}
      </div>
    </div>
  )
}
