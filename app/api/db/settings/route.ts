import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, getSupabaseServer } from '@/lib/db'

export async function POST(req: NextRequest) {
  const userId = await getAuthUser()
  if (!userId) return NextResponse.json(null, { status: 401 })
  const { autoRemind, webMode, goodNewsCategories } = await req.json()
  const row: Record<string, unknown> = { user_id: userId }
  if (autoRemind !== undefined) row.auto_remind = autoRemind
  if (webMode !== undefined) row.web_mode = webMode
  if (goodNewsCategories !== undefined) row.good_news_categories = goodNewsCategories
  await getSupabaseServer().from('user_settings').upsert(row)
  return NextResponse.json({ ok: true })
}
