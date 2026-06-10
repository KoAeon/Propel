'use client'
import { useState } from 'react'
import { Sheet } from '@/components/sheets/Sheet'
import { Press } from '@/components/ui/Press'
import { T } from '@/lib/theme'
import { useApp } from '@/context/AppContext'
import { GOOD_NEWS_PALETTE } from '@/lib/seed'
import type { GoodNews } from '@/lib/types'

const FONT_BODY = "'Manrope', system-ui, sans-serif"

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

interface Props { editId?: string }

export function GoodNewsSheet({ editId }: Props) {
  const { closeSheet, goodNews, goodNewsCategories, addGoodNews, editGoodNews, openSheet } = useApp()
  const existing = editId ? goodNews.find(g => g.id === editId) : undefined

  const [title, setTitle] = useState(existing?.title ?? '')
  const [date, setDate] = useState(existing?.date ?? todayISO())
  const [notes, setNotes] = useState(existing?.notes ?? '')
  const [category, setCategory] = useState(existing?.category ?? '')

  const ok = title.trim().length > 0

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 12,
    background: T.surface2, border: `1px solid ${T.border}`,
    color: T.text, fontFamily: FONT_BODY, fontSize: 14, outline: 'none', colorScheme: 'dark',
  }

  const handleSave = () => {
    if (!ok) return
    const entry: Omit<GoodNews, 'id'> = {
      title: title.trim(),
      date,
      notes: notes.trim() || undefined,
      category: category || undefined,
    }
    if (editId) editGoodNews(editId, entry)
    else addGoodNews(entry)
  }

  return (
    <Sheet onClose={closeSheet} title={editId ? 'Edit Good News' : 'Share Good News'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily: FONT_BODY }}>

        <textarea value={title} onChange={e => setTitle(e.target.value)}
          placeholder="What's the good news? Something you're grateful for…"
          autoFocus rows={3}
          style={{ ...inputStyle, resize: 'none', lineHeight: 1.5 }} />

        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.dim, marginBottom: 6 }}>Date</div>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: T.dim }}>Category (optional)</div>
            <Press onClick={() => openSheet({ type: 'good-news-admin' })} scale={0.95}
              style={{ fontSize: 11, fontWeight: 700, color: T.a1 }}>Manage</Press>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            <Press onClick={() => setCategory('')} scale={0.95} style={{
              padding: '7px 13px', borderRadius: 20, fontSize: 12.5, fontWeight: 700,
              background: !category ? T.surface2 : 'transparent',
              color: !category ? T.text : T.dim,
              border: `1px solid ${!category ? T.border : 'transparent'}`,
            }}>None</Press>
            {goodNewsCategories.map((c, i) => {
              const col = GOOD_NEWS_PALETTE[i % GOOD_NEWS_PALETTE.length]
              const sel = category === c
              return (
                <Press key={c} onClick={() => setCategory(c)} scale={0.95} style={{
                  padding: '7px 13px', borderRadius: 20, fontSize: 12.5, fontWeight: 700,
                  background: sel ? T.surface2 : 'transparent',
                  color: sel ? col : T.dim,
                  border: `1px solid ${sel ? col + '88' : T.border}`,
                }}>{c}</Press>
              )
            })}
          </div>
        </div>

        <textarea value={notes} onChange={e => setNotes(e.target.value)}
          placeholder="Notes (optional)" rows={2}
          style={{ ...inputStyle, resize: 'none', lineHeight: 1.5 }} />

        <Press onClick={handleSave} scale={0.97} style={{
          marginTop: 4, padding: 15, borderRadius: 16, textAlign: 'center',
          fontWeight: 700, fontSize: 15,
          background: ok ? T.grad : T.surface2,
          color: ok ? '#fff' : T.faint,
          boxShadow: ok ? T.glow : 'none',
        }}>
          {editId ? 'Save changes' : 'Add good news'}
        </Press>
      </div>
    </Sheet>
  )
}
