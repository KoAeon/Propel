import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import type { Reminder } from '@/lib/types'

const CALENDAR_API = 'https://www.googleapis.com/calendar/v3/calendars/primary/events'

function toISODate(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function nextDay(isoDate: string): string {
  const d = new Date(isoDate)
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
}

function buildEvent(reminder: Reminder) {
  const date = toISODate(reminder.days)
  const isRecurring = reminder.cat === 'Birthday'

  return {
    summary: reminder.title,
    description: reminder.sub,
    start: { date },
    end: { date: nextDay(date) },
    ...(isRecurring ? { recurrence: ['RRULE:FREQ=YEARLY'] } : {}),
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 10080 },  // 7 days
        { method: 'popup', minutes: 10080 },
        { method: 'popup', minutes: 1440 },   // 1 day
      ],
    },
    extendedProperties: {
      private: { propelId: reminder.id },
    },
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
  if (session.error === 'RefreshAccessTokenError') {
    return NextResponse.json({ error: 'Token expired — please reconnect Google' }, { status: 401 })
  }

  const { reminders }: { reminders: Reminder[] } = await req.json()
  const results: { id: string; ok: boolean; error?: string }[] = []

  for (const reminder of reminders) {
    const event = buildEvent(reminder)
    const res = await fetch(CALENDAR_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    })

    if (res.ok) {
      results.push({ id: reminder.id, ok: true })
    } else {
      const err = await res.json().catch(() => ({}))
      results.push({ id: reminder.id, ok: false, error: err?.error?.message })
    }
  }

  const allOk = results.every(r => r.ok)
  return NextResponse.json({ results, synced: results.filter(r => r.ok).length }, {
    status: allOk ? 200 : 207,
  })
}
