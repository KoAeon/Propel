import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import type { Reminder } from '@/lib/types'

const CALENDAR_API = 'https://www.googleapis.com/calendar/v3/calendars/primary/events'

function buildEvent(reminder: Reminder, timeZone: string) {
  let dateStr: string
  if (reminder.date) {
    dateStr = reminder.date
  } else {
    const d = new Date()
    d.setDate(d.getDate() + reminder.days)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    dateStr = `${yyyy}-${mm}-${dd}`
  }
  const startTime = reminder.time || '09:00'
  const [h, m] = startTime.split(':').map(Number)
  const endH = String(h + 1).padStart(2, '0')
  const start = `${dateStr}T${startTime}:00`
  const end = `${dateStr}T${endH}:${String(m).padStart(2, '0')}:00`
  const isRecurring = reminder.cat === 'Birthday'

  return {
    summary: reminder.title,
    description: reminder.sub || reminder.title,
    start: { dateTime: start, timeZone },
    end:   { dateTime: end,   timeZone },
    ...(isRecurring ? { recurrence: ['RRULE:FREQ=YEARLY'] } : {}),
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email',  minutes: 10080 }, // 7 days
        { method: 'popup',  minutes: 10080 },
        { method: 'popup',  minutes: 1440  }, // 1 day
        { method: 'popup',  minutes: 60    }, // 1 hour
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

  const { reminders, timeZone = 'UTC' }: { reminders: Reminder[]; timeZone?: string } = await req.json()
  const results: { id: string; ok: boolean; gcalEventId?: string; error?: string }[] = []

  for (const reminder of reminders) {
    const event = buildEvent(reminder, timeZone)
    const res = await fetch(CALENDAR_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    })

    if (res.ok) {
      const data = await res.json()
      results.push({ id: reminder.id, ok: true, gcalEventId: data.id })
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
