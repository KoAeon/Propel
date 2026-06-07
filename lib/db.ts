import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getSupabaseServer } from '@/lib/supabase'
import type { Habit, Reminder, Task, Project } from '@/lib/types'
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
  return { id: r.id, user_id: userId, glyph: r.glyph, title: r.title, sub: r.sub, days: r.days, date: r.date ?? null, time: r.time ?? null, cat: r.cat, gcal_event_id: r.gcalEventId ?? null }
}
export function reminderFromDb(row: Record<string, unknown>): Reminder {
  return { id: row.id as string, glyph: row.glyph as string, title: row.title as string, sub: row.sub as string, days: row.days as number, date: row.date as string | undefined, time: row.time as string | undefined, cat: row.cat as Reminder['cat'], gcalEventId: row.gcal_event_id as string | undefined }
}

export function projectToDb(p: Project, userId: string) {
  return { id: p.id, user_id: userId, title: p.title, description: p.desc, status: p.status, pillar: p.pillar }
}
export function projectFromDb(row: Record<string, unknown>): Project {
  return { id: row.id as string, title: row.title as string, desc: row.description as string, status: row.status as Project['status'], pillar: row.pillar as string }
}

export function taskToDb(t: Task, userId: string) {
  return { id: t.id, user_id: userId, title: t.title, description: t.desc, status: t.status, due: t.due ?? null, priority: t.priority, pillar: t.pillar, project_id: t.projectId ?? null, subs: t.subs }
}
export function taskFromDb(row: Record<string, unknown>): Task {
  return { id: row.id as string, title: row.title as string, desc: row.description as string, status: row.status as Task['status'], due: row.due as string, priority: row.priority as Task['priority'], pillar: row.pillar as string, projectId: row.project_id as string | undefined, subs: row.subs as Task['subs'] }
}

export function personToDb(p: Person, userId: string) {
  return { id: p.id, user_id: userId, name: p.name, relationship: p.relationship, phone: p.phone ?? null, email: p.email ?? null, dob: p.dob ?? null, notes: p.notes ?? null, photo: p.photo ?? null, person_reminders: p.reminders }
}
export function personFromDb(row: Record<string, unknown>): Person {
  return { id: row.id as string, name: row.name as string, relationship: row.relationship as Person['relationship'], phone: row.phone as string | undefined, email: row.email as string | undefined, dob: row.dob as string | undefined, notes: row.notes as string | undefined, photo: row.photo as string | undefined, reminders: (row.person_reminders ?? []) as Person['reminders'] }
}

export async function loadAllData(userId: string) {
  const sb = getSupabaseServer()
  const [habits, reminders, projects, tasks, people, settings] = await Promise.all([
    sb.from('habits').select('*').eq('user_id', userId).order('created_at'),
    sb.from('reminders').select('*').eq('user_id', userId).order('days'),
    sb.from('projects').select('*').eq('user_id', userId).order('created_at'),
    sb.from('tasks').select('*').eq('user_id', userId).order('created_at'),
    sb.from('people').select('*').eq('user_id', userId).order('name'),
    sb.from('user_settings').select('*').eq('user_id', userId).single(),
  ])
  return {
    habits: (habits.data ?? []).map(habitFromDb),
    reminders: (reminders.data ?? []).map(reminderFromDb),
    projects: (projects.data ?? []).map(projectFromDb),
    tasks: (tasks.data ?? []).map(taskFromDb),
    people: (people.data ?? []).map(personFromDb),
    autoRemind: (settings.data?.auto_remind ?? true) as boolean,
    webMode: (settings.data?.web_mode ?? false) as boolean,
  }
}

export { getSupabaseServer }
