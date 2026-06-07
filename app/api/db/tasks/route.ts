import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, getSupabaseServer, taskToDb } from '@/lib/db'

export async function POST(req: NextRequest) {
  const userId = await getAuthUser()
  if (!userId) return NextResponse.json(null, { status: 401 })
  const body = await req.json()
  await getSupabaseServer().from('tasks').upsert(taskToDb(body, userId))
  return NextResponse.json({ ok: true })
}
