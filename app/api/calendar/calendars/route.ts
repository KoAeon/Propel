import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const res = await fetch(
    'https://www.googleapis.com/calendar/v3/users/me/calendarList?minAccessRole=writer',
    { headers: { Authorization: `Bearer ${session.accessToken}` } }
  )

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch calendars' }, { status: res.status })
  }

  const data = await res.json()
  const calendars = (data.items ?? []).map((c: { id: string; summary: string; backgroundColor?: string; primary?: boolean }) => ({
    id: c.id,
    name: c.summary,
    color: c.backgroundColor ?? '#5B8DEF',
    primary: c.primary ?? false,
  }))

  return NextResponse.json({ calendars })
}
