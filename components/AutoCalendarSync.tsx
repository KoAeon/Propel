'use client'
import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useApp } from '@/context/AppContext'

export function AutoCalendarSync() {
  const { data: session, status } = useSession()
  const { reminders, setReminderEventId, flash } = useApp()
  const syncingRef = useRef(false)

  useEffect(() => {
    if (status !== 'authenticated' || !session?.accessToken || syncingRef.current) return

    const unsynced = reminders.filter(r => !r.gcalEventId)
    if (unsynced.length === 0) return

    syncingRef.current = true
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

    fetch('/api/calendar/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reminders: unsynced, timeZone }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.results) {
          data.results.forEach((r: { id: string; ok: boolean; gcalEventId?: string }) => {
            if (r.ok && r.gcalEventId) setReminderEventId(r.id, r.gcalEventId)
          })
          if (data.synced > 0) flash(`✓ ${data.synced} event${data.synced > 1 ? 's' : ''} added to Google Calendar`)
        }
      })
      .catch(() => {})
      .finally(() => { syncingRef.current = false })
  }, [reminders, status, session?.accessToken, setReminderEventId, flash])

  return null
}
