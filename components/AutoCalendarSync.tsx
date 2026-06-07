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
    if (session.error) {
      flash('Google Calendar token expired — please reconnect')
      return
    }

    const unsynced = reminders.filter(r => !r.gcalEventId)
    if (unsynced.length === 0) return

    syncingRef.current = true
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

    fetch('/api/calendar/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reminders: unsynced, timeZone }),
    })
      .then(async r => {
        const data = await r.json()
        if (!r.ok && r.status === 401) {
          flash('Google Calendar: please reconnect on the You screen')
          return
        }
        if (data.results) {
          data.results.forEach((result: { id: string; ok: boolean; gcalEventId?: string; error?: string }) => {
            if (result.ok && result.gcalEventId) setReminderEventId(result.id, result.gcalEventId)
          })
          if (data.synced > 0) flash(`✓ ${data.synced} event${data.synced > 1 ? 's' : ''} added to Google Calendar`)
          else if (data.results.some((r: { ok: boolean; error?: string }) => !r.ok)) {
            flash('Calendar sync failed — check Google connection')
          }
        }
      })
      .catch(() => flash('Calendar sync failed — check your connection'))
      .finally(() => { syncingRef.current = false })
  }, [reminders, status, session?.accessToken, session?.error, setReminderEventId, flash])

  return null
}
