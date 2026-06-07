import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getSupabaseServer } from '@/lib/supabase'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json(null, { status: 401 })

  const sb = getSupabaseServer()
  const { data } = await sb
    .from('user_data')
    .select('data')
    .eq('user_id', session.user.email)
    .single()

  return NextResponse.json(data?.data ?? null)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const sb = getSupabaseServer()

  await sb.from('user_data').upsert({
    user_id: session.user.email,
    data: body,
    updated_at: new Date().toISOString(),
  })

  return NextResponse.json({ ok: true })
}
