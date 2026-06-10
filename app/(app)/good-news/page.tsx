'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { Press } from '@/components/ui/Press'
import { T } from '@/lib/theme'
import { GOOD_NEWS_PALETTE } from '@/lib/seed'

const FONT_DISPLAY = "'Space Grotesk', 'Manrope', system-ui, sans-serif"
const FONT_BODY = "'Manrope', system-ui, sans-serif"

function formatDate(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

export default function GoodNews() {
  const router = useRouter()
  const { goodNews, goodNewsCategories, openSheet, deleteGoodNews } = useApp()
  const [filter, setFilter] = useState('All')

  const catColor = (cat?: string) => {
    if (!cat) return T.dim
    const i = goodNewsCategories.indexOf(cat)
    return i >= 0 ? GOOD_NEWS_PALETTE[i % GOOD_NEWS_PALETTE.length] : T.dim
  }

  const list = goodNews
    .filter(g => filter === 'All' || g.category === filter)
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0 16px' }}>
        <Press onClick={() => router.push('/modules')} scale={0.9} style={{ width: 38, height: 38, borderRadius: 12, background: T.surface, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="chevR" size={18} color={T.text} style={{ transform: 'scaleX(-1)' }} />
        </Press>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.3, textTransform: 'uppercase', color: T.dim }}>Gratitude & wins</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 700, letterSpacing: -.5, color: T.text, marginTop: 3 }}>Good News</div>
        </div>
        <Press onClick={() => openSheet({ type: 'good-news-admin' })} scale={0.9} style={{ width: 38, height: 38, borderRadius: 12, background: T.surface, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="cog" size={18} color={T.dim} />
        </Press>
        <Press onClick={() => openSheet({ type: 'add-good-news' })} scale={0.9} style={{ width: 38, height: 38, borderRadius: 12, background: T.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: T.glow }}>
          <Icon name="plus" size={20} color="#fff" sw={2.2} />
        </Press>
      </div>

      {/* Category filter chips */}
      {goodNewsCategories.length > 0 && (
        <div style={{ display: 'flex', gap: 7, margin: '0 -18px 6px', padding: '2px 18px', overflowX: 'auto' }}>
          {['All', ...goodNewsCategories].map(c => {
            const active = filter === c
            const col = c === 'All' ? T.a1 : catColor(c)
            return (
              <Press key={c} onClick={() => setFilter(c)} scale={0.95} style={{
                flexShrink: 0, padding: '8px 14px', borderRadius: 999, fontSize: 13, fontWeight: 700,
                background: active ? T.grad : T.surface,
                color: active ? '#fff' : T.dim,
                border: `1px solid ${active ? 'transparent' : T.border}`,
                boxShadow: active ? T.glow : 'none',
              }}>{c}</Press>
            )
          })}
        </div>
      )}

      {/* Entries */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14, fontFamily: FONT_BODY }}>
        {list.map(g => (
          <Card key={g.id} pad={14} radius={18}>
            <Press onClick={() => openSheet({ type: 'edit-good-news', id: g.id })} scale={0.99}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: T.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: T.glow, fontSize: 19 }}>
                  🎉
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: T.text, lineHeight: 1.35 }}>{g.title}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11.5, color: T.dim }}>{formatDate(g.date)}</span>
                    {g.category && (
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: catColor(g.category), padding: '2px 8px', borderRadius: 999, background: T.surface2, border: `1px solid ${catColor(g.category)}44` }}>
                        {g.category}
                      </span>
                    )}
                  </div>
                  {g.notes && <div style={{ fontSize: 12.5, color: T.faint, marginTop: 6, lineHeight: 1.5 }}>{g.notes}</div>}
                </div>
                <Press onClick={e => { e.stopPropagation(); deleteGoodNews(g.id) }} scale={0.9}
                  style={{ width: 28, height: 28, borderRadius: 8, background: T.surface2, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="trash" size={13} color={T.a3} />
                </Press>
              </div>
            </Press>
          </Card>
        ))}
        {list.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: T.faint, fontSize: 14 }}>
            {goodNews.length === 0
              ? 'No good news yet — tap + to share something you\'re grateful for'
              : 'Nothing in this category yet'}
          </div>
        )}
      </div>
    </div>
  )
}
