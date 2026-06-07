import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, getSupabaseServer } from '@/lib/db'

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getAuthUser()
  if (!userId) return NextResponse.json(null, { status: 401 })
  await getSupabaseServer().from('projects').delete().eq('id', params.id).eq('user_id', userId)
  return NextResponse.json({ ok: true })
}
