import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, getSupabaseServer, healthToDb } from '@/lib/db'

export async function POST(req: NextRequest) {
  const userId = await getAuthUser()
  if (!userId) return NextResponse.json(null, { status: 401 })
  const body = await req.json()
  await getSupabaseServer().from('health_activities').upsert(healthToDb(body, userId))
  return NextResponse.json({ ok: true })
}
