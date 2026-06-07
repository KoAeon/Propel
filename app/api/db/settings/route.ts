import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, getSupabaseServer } from '@/lib/db'

export async function POST(req: NextRequest) {
  const userId = await getAuthUser()
  if (!userId) return NextResponse.json(null, { status: 401 })
  const { autoRemind, webMode } = await req.json()
  await getSupabaseServer().from('user_settings').upsert({ user_id: userId, auto_remind: autoRemind, web_mode: webMode })
  return NextResponse.json({ ok: true })
}
