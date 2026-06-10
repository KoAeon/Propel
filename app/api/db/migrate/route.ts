import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, getSupabaseServer, habitToDb, reminderToDb, taskToDb, projectToDb, personToDb, goodNewsToDb } from '@/lib/db'

export async function POST(req: NextRequest) {
  const userId = await getAuthUser()
  if (!userId) return NextResponse.json(null, { status: 401 })

  const data = await req.json()
  const sb = getSupabaseServer()

  await Promise.all([
    data.habits?.length && sb.from('habits').upsert(data.habits.map((h: Parameters<typeof habitToDb>[0]) => habitToDb(h, userId))),
    data.reminders?.length && sb.from('reminders').upsert(data.reminders.map((r: Parameters<typeof reminderToDb>[0]) => reminderToDb(r, userId))),
    data.projects?.length && sb.from('projects').upsert(data.projects.map((p: Parameters<typeof projectToDb>[0]) => projectToDb(p, userId))),
    data.tasks?.length && sb.from('tasks').upsert(data.tasks.map((t: Parameters<typeof taskToDb>[0]) => taskToDb(t, userId))),
    data.people?.length && sb.from('people').upsert(data.people.map((p: Parameters<typeof personToDb>[0]) => personToDb(p, userId))),
    data.goodNews?.length && sb.from('good_news').upsert(data.goodNews.map((g: Parameters<typeof goodNewsToDb>[0]) => goodNewsToDb(g, userId))),
    sb.from('user_settings').upsert({ user_id: userId, auto_remind: data.autoRemind ?? true, web_mode: data.webMode ?? false, good_news_categories: data.goodNewsCategories ?? null }),
  ])

  return NextResponse.json({ ok: true })
}
