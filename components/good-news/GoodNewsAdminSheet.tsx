'use client'
import { useState } from 'react'
import { Sheet } from '@/components/sheets/Sheet'
import { Press } from '@/components/ui/Press'
import { Icon } from '@/components/ui/Icon'
import { T } from '@/lib/theme'
import { useApp } from '@/context/AppContext'
import { GOOD_NEWS_PALETTE } from '@/lib/seed'

const FONT_BODY = "'Manrope', system-ui, sans-serif"

export function GoodNewsAdminSheet() {
  const { closeSheet, goodNewsCategories, setGoodNewsCategories } = useApp()
  const [cats, setCats] = useState<string[]>(goodNewsCategories)
  const [draft, setDraft] = useState('')

  const inputStyle: React.CSSProperties = {
    flex: 1, boxSizing: 'border-box', padding: '11px 13px', borderRadius: 12,
    background: T.surface2, border: `1px solid ${T.border}`,
    color: T.text, fontFamily: FONT_BODY, fontSize: 14, outline: 'none',
  }

  const rename = (i: number, value: string) => setCats(cs => cs.map((c, j) => j === i ? value : c))
  const remove = (i: number) => setCats(cs => cs.filter((_, j) => j !== i))
  const add = () => {
    const v = draft.trim()
    if (!v || cats.some(c => c.toLowerCase() === v.toLowerCase())) return
    setCats(cs => [...cs, v])
    setDraft('')
  }

  const handleSave = () => {
    const cleaned = cats.map(c => c.trim()).filter(Boolean)
    setGoodNewsCategories(cleaned)
  }

  return (
    <Sheet onClose={closeSheet} title="Manage Categories">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontFamily: FONT_BODY }}>
        <div style={{ fontSize: 12.5, color: T.dim, lineHeight: 1.5, marginBottom: 2 }}>
          Edit, rename, or remove the categories you use to label your good news.
        </div>

        {cats.map((c, i) => {
          const col = GOOD_NEWS_PALETTE[i % GOOD_NEWS_PALETTE.length]
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: col, flexShrink: 0 }} />
              <input value={c} onChange={e => rename(i, e.target.value)} style={inputStyle} />
              <Press onClick={() => remove(i)} scale={0.9}
                style={{ width: 38, height: 38, borderRadius: 10, background: T.surface2, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="trash" size={15} color={T.a3} />
              </Press>
            </div>
          )
        })}

        {cats.length === 0 && (
          <div style={{ fontSize: 12.5, color: T.faint, padding: '6px 0' }}>No categories — add one below.</div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <input value={draft} onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') add() }}
            placeholder="New category" style={inputStyle} />
          <Press onClick={add} scale={0.9}
            style={{ width: 38, height: 38, borderRadius: 10, background: T.grad, boxShadow: T.glow, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="plus" size={18} color="#fff" sw={2.2} />
          </Press>
        </div>

        <Press onClick={handleSave} scale={0.97} style={{
          marginTop: 6, padding: 15, borderRadius: 16, textAlign: 'center',
          fontWeight: 700, fontSize: 15, background: T.grad, color: '#fff', boxShadow: T.glow,
        }}>
          Save categories
        </Press>
      </div>
    </Sheet>
  )
}
