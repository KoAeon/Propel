import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, getSupabaseServer, projectToDb } from '@/lib/db'

export async function POST(req: NextRequest) {
  const userId = await getAuthUser()
  if (!userId) return NextResponse.json(null, { status: 401 })
  const body = await req.json()
  await getSupabaseServer().from('projects').upsert(projectToDb(body, userId))
  return NextResponse.json({ ok: true })
}
