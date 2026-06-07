'use client'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { Card } from '@/components/ui/Card'
import { Ring } from '@/components/ui/Ring'
import { Tile } from '@/components/ui/Tile'
import { Icon } from '@/components/ui/Icon'
import { Press } from '@/components/ui/Press'
import { T } from '@/lib/theme'

const FONT_DISPLAY = "'Space Grotesk', 'Manrope', system-ui, sans-serif"
const FONT_BODY = "'Manrope', system-ui, sans-serif"

export default function Habits() {
  const router = useRouter()
  const { habits, toggleHabit, deleteHabit, openSheet } = useApp()

  const done = habits.filter(h => h.done).length
  const pct = habits.length ? Math.round((done / habits.length) * 100) : 0

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0 16px' }}>
        <Press onClick={() => router.push('/modules')} scale={0.9} style={{ width: 38, height: 38, borderRadius: 12, background: T.surface, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="chevR" size={18} color={T.text} style={{ transform: 'scaleX(-1)' }} />
        </Press>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.3, textTransform: 'uppercase', color: T.dim }}>Build · Track · Streak</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 700, letterSpacing: -.5, color: T.text, marginTop: 3 }}>Daily Habits</div>
        </div>
        <Press onClick={() => openSheet({ type: 'add-habit' })} scale={0.9}
          style={{ width: 38, height: 38, borderRadius: 12, background: T.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: T.glow }}>
          <Icon name="plus" size={20} color="#fff" sw={2.2} />
        </Press>
      </div>

      {/* Progress card */}
      <Card pad={16} radius={20} glow style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 4 }}>
        <Ring pct={pct} size={66} stroke={7}>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 17, color: T.text }}>
            {done}/{habits.length}
          </div>
        </Ring>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>
            {done >= habits.length ? 'All done — incredible!' : done >= habits.length / 2 ? 'Strong day, keep going' : "Let's get moving"}
          </div>
          <div style={{ fontSize: 12.5, color: T.dim, marginTop: 3 }}>
            {habits.length - done} habits left · tap to check off
          </div>
        </div>
      </Card>

      {/* Habit list */}
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 9 }}>
        {habits.map(h => (
          <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Press onClick={() => toggleHabit(h.id)} scale={0.99} style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 13, padding: '11px 13px',
                background: h.done ? 'rgba(255,255,255,.05)' : T.surface,
                border: `1px solid ${T.border}`, borderRadius: 17,
                position: 'relative', overflow: 'hidden',
              }}>
                {h.done && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: T.grad }} />}
                <Tile glyph={h.glyph} from={h.from} to={h.to} size={42} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.text, letterSpacing: -.2 }}>{h.name}</div>
                  <div style={{ fontSize: 12.5, color: T.dim, marginTop: 2 }}>
                    {h.meta}
                    {h.streak > 0 && <span style={{ color: T.warn, fontWeight: 600 }}> · 🔥 {h.streak} day</span>}
                  </div>
                </div>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: h.done ? T.grad : 'transparent',
                  border: h.done ? 'none' : `2px solid ${T.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: h.done ? T.glow : 'none',
                  transition: 'all .2s ease',
                }}>
                  {h.done && <Icon name="check" size={14} color="#fff" sw={2.6} />}
                </div>
              </div>
            </Press>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <Press onClick={() => openSheet({ type: 'edit-habit', id: h.id })} scale={0.9}
                style={{ width: 28, height: 28, borderRadius: 8, background: T.surface, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="pencil" size={12} color={T.dim} />
              </Press>
              <Press onClick={() => deleteHabit(h.id)} scale={0.9}
                style={{ width: 28, height: 28, borderRadius: 8, background: T.surface, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="trash" size={12} color={T.a3} />
              </Press>
            </div>
          </div>
        ))}
        {habits.length === 0 && (
          <div style={{ padding: '40px 0', textAlign: 'center', color: T.faint, fontSize: 13 }}>
            No habits yet — tap + to add one
          </div>
        )}
      </div>
    </div>
  )
}
