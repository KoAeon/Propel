import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getSupabaseServer } from '@/lib/supabase'
import type { Habit, Reminder, Task, Project, GoodNews, RenoTask } from '@/lib/types'
import type { Person } from '@/lib/people'

export async function getAuthUser() {
  const session = await getServerSession(authOptions)
  return session?.user?.email ?? null
}

export function habitToDb(h: Habit, userId: string) {
  return { id: h.id, user_id: userId, glyph: h.glyph, grad_from: h.from, grad_to: h.to, name: h.name, meta: h.meta, streak: h.streak, done: h.done }
}
export function habitFromDb(row: Record<string, unknown>): Habit {
  return { id: row.id as string, glyph: row.glyph as string, from: row.grad_from as string, to: row.grad_to as string, name: row.name as string, meta: row.meta as string, streak: row.streak as number, done: row.done as boolean }
}

export function reminderToDb(r: Reminder, userId: string) {
  return { id: r.id, user_id: userId, glyph: r.glyph, title: r.title, sub: r.sub, days: r.days, date: r.date ?? null, time: r.time ?? null, freq: r.freq ?? null, calendar_id: r.calendarId ?? null, cat: r.cat, gcal_event_id: r.gcalEventId ?? null }
}
export function reminderFromDb(row: Record<string, unknown>): Reminder {
  return { id: row.id as string, glyph: row.glyph as string, title: row.title as string, sub: row.sub as string, days: row.days as number, date: row.date as string | undefined, time: row.time as string | undefined, freq: row.freq as Reminder['freq'], calendarId: row.calendar_id as string | undefined, cat: row.cat as Reminder['cat'], gcalEventId: row.gcal_event_id as string | undefined }
}

export function projectToDb(p: Project, userId: string) {
  return { id: p.id, user_id: userId, title: p.title, description: p.desc, status: p.status, pillar: p.pillar }
}
export function projectFromDb(row: Record<string, unknown>): Project {
  return { id: row.id as string, title: row.title as string, desc: row.description as string, status: row.status as Project['status'], pillar: row.pillar as string }
}

export function taskToDb(t: Task, userId: string) {
  return { id: t.id, user_id: userId, title: t.title, description: t.desc, status: t.status, due: t.due ?? null, time: t.time ?? null, priority: t.priority, pillar: t.pillar, project_id: t.projectId ?? null, reminder_id: t.reminderId ?? null, subs: t.subs }
}
export function taskFromDb(row: Record<string, unknown>): Task {
  return { id: row.id as string, title: row.title as string, desc: row.description as string, status: row.status as Task['status'], due: row.due as string, time: row.time as string | undefined, priority: row.priority as Task['priority'], pillar: row.pillar as string, projectId: row.project_id as string | undefined, reminderId: row.reminder_id as string | undefined, subs: row.subs as Task['subs'] }
}

export function personToDb(p: Person, userId: string) {
  return { id: p.id, user_id: userId, name: p.name, relationship: p.relationship, phone: p.phone ?? null, email: p.email ?? null, dob: p.dob ?? null, notes: p.notes ?? null, photo: p.photo ?? null, person_reminders: p.reminders }
}
export function personFromDb(row: Record<string, unknown>): Person {
  return { id: row.id as string, name: row.name as string, relationship: row.relationship as Person['relationship'], phone: row.phone as string | undefined, email: row.email as string | undefined, dob: row.dob as string | undefined, notes: row.notes as string | undefined, photo: row.photo as string | undefined, reminders: (row.person_reminders ?? []) as Person['reminders'] }
}

export function goodNewsToDb(g: GoodNews, userId: string) {
  return { id: g.id, user_id: userId, date: g.date ?? null, title: g.title, notes: g.notes ?? null, category: g.category ?? null }
}
export function goodNewsFromDb(row: Record<string, unknown>): GoodNews {
  return { id: row.id as string, date: row.date as string, title: row.title as string, notes: row.notes as string | undefined, category: row.category as string | undefined }
}

export function renoTaskToDb(t: RenoTask, userId: string) {
  return { id: t.id, user_id: userId, title: t.title, notes: t.notes, assigned_to: t.assignedTo || null, due_date: t.dueDate || null, date_completed: t.dateCompleted || null, status: t.status }
}
export function renoTaskFromDb(row: Record<string, unknown>): RenoTask {
  return { id: row.id as string, title: row.title as string, notes: (row.notes ?? '') as string, assignedTo: (row.assigned_to ?? '') as RenoTask['assignedTo'], dueDate: (row.due_date ?? '') as string, dateCompleted: (row.date_completed ?? '') as string, status: (row.status ?? 'Not Started') as RenoTask['status'] }
}

export async function loadAllData(userId: string) {
  const sb = getSupabaseServer()
  const [habits, reminders, projects, tasks, people, goodNews, renoTasks, settings] = await Promise.all([
    sb.from('habits').select('*').eq('user_id', userId).order('created_at'),
    sb.from('reminders').select('*').eq('user_id', userId).order('days'),
    sb.from('projects').select('*').eq('user_id', userId).order('created_at'),
    sb.from('tasks').select('*').eq('user_id', userId).order('created_at'),
    sb.from('people').select('*').eq('user_id', userId).order('name'),
    sb.from('good_news').select('*').eq('user_id', userId).order('date', { ascending: false }),
    sb.from('reno_tasks').select('*').eq('user_id', userId).order('created_at'),
    sb.from('user_settings').select('*').eq('user_id', userId).single(),
  ])
  return {
    habits: (habits.data ?? []).map(habitFromDb),
    reminders: (reminders.data ?? []).map(reminderFromDb),
    projects: (projects.data ?? []).map(projectFromDb),
    tasks: (tasks.data ?? []).map(taskFromDb),
    people: (people.data ?? []).map(personFromDb),
    goodNews: (goodNews.data ?? []).map(goodNewsFromDb),
    renoTasks: (renoTasks.data ?? []).map(renoTaskFromDb),
    autoRemind: (settings.data?.auto_remind ?? true) as boolean,
    webMode: (settings.data?.web_mode ?? false) as boolean,
    goodNewsCategories: (settings.data?.good_news_categories ?? null) as string[] | null,
  }
}

export { getSupabaseServer }
